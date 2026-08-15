# نقشه‌راه طراحی سیستم

سایت ایستای فارسی برای یادگیری طراحی سیستم — ۷۷۲ موضوع در ۲۶ دسته،
هر موضوع صفحهٔ خودش را با تب‌های نمای کلی، سرفصل‌ها، منابع، ویدیوها،
برگهٔ تقلب و پرسش‌وپاسخ دارد.

**پشته:** Astro (SSG) · بدون فریم‌ورک کلاینتی · Pagefind برای جست‌وجو · GitHub Pages

## شروع

```bash
npm install
npm run dev        # http://localhost:4321/system-design-roadmap/
```

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد ایستا + ایندکس جست‌وجو |
| `npm run preview` | پیش‌نمایش خروجی بیلد |
| `npm run import` | همگام‌سازی محتوا با `roadmap.txt` |

> جست‌وجو فقط روی خروجی `build` کار می‌کند؛ Pagefind ایندکس را بعد از بیلد می‌سازد.

## ساختار

```
src/
├─ content/
│  ├─ sections/          ۲۶ دسته (آیتم‌های نوار کناری)
│  ├─ topics/<section>/   ۷۷۲ موضوع، یک فایل مارک‌داون برای هر کدام
│  └─ i18n/parts/*.json   ترجمهٔ عنوان و توضیح
├─ components/           Sidebar, TopBar, Tabs, Icon
├─ layouts/Base.astro    پوسته، RTL، پوسته‌ٔ روشن/تاریک، جست‌وجو
├─ pages/
│  ├─ index.astro             صفحهٔ نقشه‌راه
│  ├─ [section]/index.astro   صفحهٔ دسته
│  └─ [section]/[topic].astro صفحهٔ موضوع با تب‌ها
└─ styles/global.css     توکن‌های طراحی

scripts/import-roadmap.mjs   roadmap.txt → فایل‌های محتوا
legacy/                      نسخهٔ تک‌فایلی قبلی (بایگانی)
```

نوشتن و مدیریت محتوا: [CONTENT.md](CONTENT.md)

## انتشار

پوش روی `main` باعث اجرای [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) می‌شود.
یک بار در تنظیمات ریپو **Settings → Pages → Source** را روی *GitHub Actions* بگذارید.

مسیر پایه در [astro.config.mjs](astro.config.mjs) روی `/system-design-roadmap` تنظیم شده؛
اگر نام ریپو عوض شد، `base` و `public/site.webmanifest` را هم به‌روز کنید.
