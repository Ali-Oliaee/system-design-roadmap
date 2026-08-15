// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// سایت روی دامنه اختصاصی (public/CNAME) از ریشه سرو می شود
const SITE = 'https://sys-design.ir';

export default defineConfig({
  site: SITE,
  base: '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
  },
});
