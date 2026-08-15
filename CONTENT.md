# راهنمای مدیریت محتوا

## ساختار

```
src/content/
├─ sections/            ۲۶ فایل = آیتم‌های نوار کناری
│  └─ security.md
├─ topics/              ۷۷۲ فایل = صفحه‌های موضوع
│  └─ security/
│     └─ what-is-a-cookie.md
└─ i18n/parts/*.json    ترجمهٔ عنوان و توضیح (خوراک اسکریپت import)
```

آدرس هر صفحه از مسیر فایل ساخته می‌شود:
`topics/security/what-is-a-cookie.md` → `/security/what-is-a-cookie/`

## نوشتن یک موضوع

هر موضوع **یک فایل مارک‌داون** است. تب‌ها از فرانت‌متر و بدنه ساخته می‌شوند؛
**تبِ بدون داده اصلاً رندر نمی‌شود.**

| تب | منبع داده |
| --- | --- |
| نمای کلی | بدنهٔ مارک‌داون |
| سرفصل‌ها | خودکار از تیترهای `##` و `###` |
| منابع | `resources:` |
| ویدیوها | `videos:` |
| برگهٔ تقلب | `cheatsheet:` |
| پرسش و پاسخ | `faq:` |

نمونهٔ کامل: [src/content/topics/security/what-is-a-cookie.md](src/content/topics/security/what-is-a-cookie.md)

### فرانت‌متر

```yaml
---
title: "کوکی چیست؟"            # اجباری — عنوان فارسی
titleEn: "What is a Cookie?"   # زیرعنوان لاتین (اختیاری)
summary: "توضیح یک‌خطی."        # در کارت دسته و متای صفحه می‌آید
section: "security"            # اسلاگ فایل داخل sections/
order: 27                      # ترتیب در دسته
done: true                     # پوشش محتوا (نه پیشرفت کاربر)
updated: 2026-08-10
tags: ["HTTP", "نشست"]
icon: "lock"                   # اختیاری؛ پیش‌فرض آیکون دسته
telegram: "https://t.me/..."   # دکمهٔ «پست تلگرام»
source: "https://..."          # دکمهٔ «منبع اصلی»

resources:
  - { title: "MDN", url: "https://...", kind: docs, note: "توضیح کوتاه" }
videos:
  - { title: "...", url: "https://...", kind: video }
cheatsheet:
  - { term: "Secure", meaning: "..." }
faq:
  - { q: "...", a: "..." }

related: ["cookies-vs-sessions"]   # اسلاگ موضوع‌های هم‌دسته
draft: false                       # true = فقط در dev دیده می‌شود
---
```

`kind` یکی از: `article` `docs` `video` `book` `tool` `repo` `telegram`

### نکات نگارشی

- کد، دستور و نام فایل را داخل بک‌تیک بگذارید؛ خودکار چپ‌به‌راست می‌شود.
- بلوک کد با ` ```http ` یا ` ```ts ` — هایلایت در هر دو پوسته کار می‌کند.
- جدول‌ها خودکار اسکرول افقی می‌گیرند.

## افزودن یک دسته

فایل تازه در `src/content/sections/` بسازید:

```yaml
---
title: "نام فارسی"
titleEn: "English Name"
summary: "یک جمله."
icon: "db"
group: core            # core | tracks | concepts
kind: roadmap          # roadmap = کارتی، concept = واژه‌نامه‌ای
order: 12
---
```

آیکون‌های موجود در [src/components/Icon.astro](src/components/Icon.astro) تعریف شده‌اند.

## همگام‌سازی با roadmap.txt

`roadmap.txt` هنوز منبع اولیهٔ فهرست است. بعد از ویرایش آن:

```bash
npm run import
```

اسکریپت **فرانت‌متر را به‌روز می‌کند ولی بدنهٔ دست‌نویس را دست نمی‌زند**
(فایل‌هایی که هنوز `<!-- stub:auto -->` دارند استاب حساب می‌شوند).
برای بازنویسی کامل: `npm run import -- --force`

عنوان‌های ترجمه‌نشده در `src/content/i18n/_missing.json` جمع می‌شوند؛
ترجمه را در یکی از فایل‌های `src/content/i18n/parts/*.json` اضافه کنید
(کلید = متن انگلیسی؛ برای توضیح، کلید را با `::` شروع کنید).

وقتی محتوای همهٔ موضوع‌ها فارسی شد، `roadmap.txt` و اسکریپت import قابل حذف‌اند.

## دستورها

```bash
npm run dev       # سرور توسعه
npm run build     # بیلد + ایندکس جست‌وجو (Pagefind)
npm run preview   # پیش‌نمایش خروجی بیلد
npm run import    # roadmap.txt → فایل‌های محتوا
```

جست‌وجو فقط روی خروجی `build` کار می‌کند (Pagefind بعد از بیلد ایندکس می‌سازد).

## انتشار

پوش روی `main` → اکشن `.github/workflows/deploy.yml` بیلد و روی GitHub Pages منتشر می‌کند.
یک‌بار در تنظیمات ریپو، Pages → Source را روی **GitHub Actions** بگذارید.
