import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: 域名到位后替换 site（影响 sitemap/canonical 的绝对 URL）
export default defineConfig({
  site: 'https://arclink-placeholder.example',
  output: 'static',
  integrations: [react(), sitemap()],
});
