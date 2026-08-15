import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/** لینک بیرونی (منبع، ویدیو، ابزار) */
const link = z.object({
  title: z.string(),
  url: z.url(),
  /** برچسب کوچکی که کنار لینک نشان داده می شود */
  kind: z.enum(['article', 'docs', 'video', 'book', 'tool', 'repo', 'telegram']).default('article'),
  note: z.string().optional(),
});

/**
 * دسته ها = آیتم های نوار کناری.
 * هر دسته به یک «گروه» تعلق دارد (مسیر اصلی / مسیرهای تخصصی / مفاهیم).
 */
const sections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sections' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    summary: z.string().default(''),
    icon: z.string().default('layers'),
    group: z.enum(['core', 'tracks', 'concepts']),
    /** concept = چیدمان واژه نامه ای تک ستونه */
    kind: z.enum(['roadmap', 'concept']).default('roadmap'),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

/**
 * موضوع ها = صفحهٔ اختصاصی هر آیتم.
 * تب ها از همین فرانت متر ساخته می شوند؛ تبِ خالی اصلاً رندر نمی شود.
 */
const topics = defineCollection({
  // رندر مارک داون تا لحظهٔ نیاز به تعویق می افتد — با ۷۰۰+ فایل تفاوتش محسوس است
  loader: glob({ pattern: '**/*.md', base: './src/content/topics', deferRender: true }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    summary: z.string().default(''),
    section: reference('sections'),
    order: z.number().default(999),
    /** وضعیت پوشش محتوا (نه پیشرفت کاربر) */
    done: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
    icon: z.string().optional(),

    // ---- منابع اصلی (از roadmap.txt) ----
    telegram: z.url().optional(),
    source: z.url().optional(),

    // ---- تب ها ----
    resources: z.array(link).default([]),
    videos: z.array(link).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    cheatsheet: z.array(z.object({ term: z.string(), meaning: z.string() })).default([]),

    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { sections, topics };
