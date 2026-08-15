import { getCollection, type CollectionEntry } from 'astro:content';

export type Section = CollectionEntry<'sections'>;
export type Topic = CollectionEntry<'topics'>;

export const GROUP_LABELS: Record<string, { title: string; summary: string; order: number }> = {
  core: { title: 'مسیر اصلی', summary: 'ستون فقرات طراحی سیستم — از مبانی تا مصاحبهٔ فنی.', order: 1 },
  tracks: { title: 'مسیرهای تخصصی', summary: 'عمق بخشی بر اساس نقش: فرانت اند، بک اند و موبایل.', order: 2 },
  concepts: { title: 'مفاهیم و واژه نامه', summary: 'تعریف های کوتاه برای مرور سریع.', order: 3 },
};

const isPublished = <T extends { data: { draft?: boolean } }>(e: T) =>
  import.meta.env.DEV || !e.data.draft;

/** آیدی رفرنس ممکن است رشته یا آبجکت باشد — هر دو را نرمال می کند */
const refId = (v: unknown): string =>
  typeof v === 'string' ? v : ((v as { id: string })?.id ?? '');

export interface NavSection {
  slug: string;
  data: Section['data'];
  topics: Topic[];
  total: number;
  done: number;
}

export interface NavGroup {
  id: string;
  title: string;
  summary: string;
  sections: NavSection[];
}

let cache: NavGroup[] | null = null;

/** درخت کامل نوار کناری — یک بار در هر بیلد ساخته می شود */
export async function getNav(): Promise<NavGroup[]> {
  if (cache) return cache;

  const [sections, topics] = await Promise.all([
    getCollection('sections', isPublished),
    getCollection('topics', isPublished),
  ]);

  const bySection = new Map<string, Topic[]>();
  for (const t of topics) {
    const key = refId(t.data.section);
    const list = bySection.get(key);
    if (list) list.push(t);
    else bySection.set(key, [t]);
  }
  for (const list of bySection.values()) {
    list.sort((a, b) => a.data.order - b.data.order);
  }

  const navSections: NavSection[] = sections
    .sort((a, b) => a.data.order - b.data.order)
    .map((s) => {
      const list = bySection.get(s.id) ?? [];
      return {
        slug: s.id,
        data: s.data,
        topics: list,
        total: list.length,
        done: list.filter((t) => t.data.done).length,
      };
    });

  cache = Object.entries(GROUP_LABELS)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([id, meta]) => ({
      id,
      title: meta.title,
      summary: meta.summary,
      sections: navSections.filter((s) => s.data.group === id),
    }))
    .filter((g) => g.sections.length > 0);

  return cache;
}

export async function getSectionTopics(sectionSlug: string): Promise<Topic[]> {
  const nav = await getNav();
  for (const g of nav) {
    const hit = g.sections.find((s) => s.slug === sectionSlug);
    if (hit) return hit.topics;
  }
  return [];
}

export async function getStats() {
  const nav = await getNav();
  const all = nav.flatMap((g) => g.sections);
  const total = all.reduce((n, s) => n + s.total, 0);
  const done = all.reduce((n, s) => n + s.done, 0);
  return { total, done, sections: all.length, pct: total ? Math.round((done / total) * 100) : 0 };
}

/**
 * آدرس سازی با احترام به base در gh-pages.
 * مسیر صفحه اسلش پایانی می گیرد، ولی فایل (هر چیزی با پسوند) نه —
 * وگرنه assets/favicon.svg/ تبدیل به ۴۰۴ می شود.
 */
export const url = (p = '') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rest = p.replace(/^\//, '');
  if (!rest) return `${base}/`;
  const isFile = /\.[a-z0-9]+$/i.test(rest);
  return isFile ? `${base}/${rest}` : `${base}/${rest}/`;
};

export const topicUrl = (t: Topic) => url(`${refId(t.data.section)}/${topicSlug(t)}`);
export const sectionUrl = (slug: string) => url(slug);

/** id موضوع «<section>/<slug>» است — فقط بخش دوم را می خواهیم */
export const topicSlug = (t: Topic) => t.id.split('/').pop()!;

export { refId };
