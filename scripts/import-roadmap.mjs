#!/usr/bin/env node
/**
 * roadmap.txt  ->  src/content/sections/*.md  +  src/content/topics/<section>/<topic>.md
 *
 * اجرا:  npm run import
 *
 * قابل اجرای مکرر است. بدنهٔ مارک‌داونی که دستی نوشته‌اید حفظ می‌شود؛
 * فقط فرانت‌متر با roadmap.txt و فایل ترجمه هم‌گام می‌شود.
 * برای بازنویسی کامل:  npm run import -- --force
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { GROUPS, SECTIONS, SECTION_SLUG_OVERRIDES } from './taxonomy.mjs';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'roadmap.txt');
const SECTIONS_DIR = path.join(ROOT, 'src/content/sections');
const TOPICS_DIR = path.join(ROOT, 'src/content/topics');
const TITLES_FILE = path.join(ROOT, 'src/content/i18n/titles.json');

const FORCE = process.argv.includes('--force');

/* ---------------------------------------------------------- ابزارهای کمکی */

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'topic';

/** رشته را برای YAML امن می‌کند (همیشه نقل‌قول دوتایی) */
const yq = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const isTelegram = (u) => /^https?:\/\/(t\.me|telegram\.me)\//i.test(u);

/* --------------------------------------------------------------- ترجمه‌ها */

// ترجمه‌ها تکه‌تکه در i18n/parts/*.json نگه‌داری می‌شوند تا فایل‌ها قابل‌مدیریت بمانند
let TITLES = {};
const PARTS_DIR = path.join(ROOT, 'src/content/i18n/parts');
if (fs.existsSync(PARTS_DIR)) {
  for (const f of fs.readdirSync(PARTS_DIR).sort()) {
    if (!f.endsWith('.json')) continue;
    Object.assign(TITLES, JSON.parse(fs.readFileSync(path.join(PARTS_DIR, f), 'utf8')));
  }
}
if (fs.existsSync(TITLES_FILE)) {
  Object.assign(TITLES, JSON.parse(fs.readFileSync(TITLES_FILE, 'utf8')));
}
const missingTitles = [];
const fa = (en) => {
  const hit = TITLES[en];
  if (hit && hit.trim()) return hit.trim();
  missingTitles.push(en);
  return en; // تا وقتی ترجمه نشده، متن انگلیسی می‌ماند
};
const faDesc = (en) => {
  const hit = TITLES[`::${en}`];
  return hit && hit.trim() ? hit.trim() : en;
};

/* ------------------------------------------------------------ پارسر متن */

function parse(text) {
  const out = [];
  let group = null;
  let section = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(';')) continue;

    if (line.startsWith('## ')) {
      const [name, icon, flag] = line
        .slice(3)
        .split('|')
        .map((p) => p.trim());
      section = {
        nameEn: name,
        icon: icon || 'layers',
        kind: flag === 'concept' ? 'concept' : 'roadmap',
        group,
        items: [],
      };
      out.push(section);
      continue;
    }

    if (line.startsWith('# ')) {
      group = line.slice(2).trim();
      section = null;
      continue;
    }

    const m = line.match(/^\[( |x|X)\]\s*(.+)$/);
    if (!m || !section) continue;

    const done = m[1].toLowerCase() === 'x';
    // لینک‌ها با «|» جدا می‌شوند و همیشه بعد از عنوان/توضیح می‌آیند
    const parts = m[2].split('|').map((p) => p.trim()).filter(Boolean);
    const head = parts.shift() ?? '';
    const [titleEn, descEn = ''] = head.split(' :: ').map((p) => p.trim());

    let telegram, source;
    for (let p of parts) {
      let forced = null;
      if (/^tg:/i.test(p)) (forced = 'tg'), (p = p.replace(/^tg:/i, '').trim());
      if (/^src:/i.test(p)) (forced = 'src'), (p = p.replace(/^src:/i, '').trim());
      if (!/^https?:\/\//i.test(p)) continue;
      const slot = forced ?? (isTelegram(p) ? 'tg' : 'src');
      if (slot === 'tg') telegram ??= p;
      else source ??= p;
    }

    section.items.push({ titleEn, descEn, done, telegram, source });
  }

  return out;
}

/* -------------------------------------------- نوشتن با حفظ بدنهٔ دست‌نویس */

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function writeEntry(file, frontmatter, defaultBody) {
  let body = defaultBody;
  if (fs.existsSync(file) && !FORCE) {
    const prev = fs.readFileSync(file, 'utf8');
    const rest = prev.replace(FM, '');
    // بدنهٔ ویرایش‌شده را نگه دار؛ فقط استاب خودکار را دور بریز
    if (rest.trim() && !rest.includes('<!-- stub:auto -->')) body = rest.replace(/^\n+/, '');
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\n${frontmatter}\n---\n\n${body}`, 'utf8');
}

/* ------------------------------------------------------------------ اجرا */

const sections = parse(fs.readFileSync(SOURCE, 'utf8'));
const usedSlugs = new Map();
let topicCount = 0;

sections.forEach((sec, i) => {
  const meta = SECTIONS[sec.nameEn];
  if (!meta) {
    console.warn(`⚠️  دسته بدون ترجمه: «${sec.nameEn}» — به scripts/taxonomy.mjs اضافه کنید`);
  }
  const group = GROUPS[sec.group];
  if (!group) throw new Error(`گروه ناشناخته: ${sec.group}`);

  const overrideKey = `${group.id}::${sec.nameEn}`;
  const slug =
    SECTION_SLUG_OVERRIDES[overrideKey] ?? meta?.slug ?? slugify(sec.nameEn);
  if (usedSlugs.has(slug)) {
    throw new Error(
      `تداخل اسلاگ «${slug}» بین «${usedSlugs.get(slug)}» و «${sec.nameEn}» — در taxonomy.mjs یک slug دستی بدهید`,
    );
  }
  usedSlugs.set(slug, sec.nameEn);

  writeEntry(
    path.join(SECTIONS_DIR, `${slug}.md`),
    [
      `title: ${yq(meta?.title ?? sec.nameEn)}`,
      `titleEn: ${yq(sec.nameEn)}`,
      `summary: ${yq(meta?.summary ?? '')}`,
      `icon: ${yq(sec.icon)}`,
      `group: ${group.id}`,
      `kind: ${sec.kind}`,
      `order: ${i + 1}`,
    ].join('\n'),
    `<!-- stub:auto -->\n`,
  );

  const topicSlugs = new Set();
  sec.items.forEach((item, j) => {
    let tslug = slugify(item.titleEn);
    while (topicSlugs.has(tslug)) tslug = `${tslug}-${j}`;
    topicSlugs.add(tslug);

    const summary = item.descEn ? faDesc(item.descEn) : '';
    const fm = [
      `title: ${yq(fa(item.titleEn))}`,
      `titleEn: ${yq(item.titleEn)}`,
      `summary: ${yq(summary)}`,
      `section: ${yq(slug)}`,
      `order: ${j + 1}`,
      `done: ${item.done}`,
    ];
    if (item.telegram) fm.push(`telegram: ${yq(item.telegram)}`);
    if (item.source) fm.push(`source: ${yq(item.source)}`);

    writeEntry(
      path.join(TOPICS_DIR, slug, `${tslug}.md`),
      fm.join('\n'),
      `<!-- stub:auto -->\n`,
    );
    topicCount++;
  });
});

console.log(`✅ ${sections.length} دسته و ${topicCount} موضوع ساخته شد.`);

if (missingTitles.length) {
  const uniq = [...new Set(missingTitles)];
  const outFile = path.join(ROOT, 'src/content/i18n/_missing.json');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(
    outFile,
    JSON.stringify(Object.fromEntries(uniq.map((t) => [t, ''])), null, 2),
    'utf8',
  );
  console.log(`ℹ️  ${uniq.length} عنوان هنوز ترجمه نشده → src/content/i18n/_missing.json`);
}
