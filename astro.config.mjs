import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: 域名到位后替换 site（影响 sitemap/canonical 的绝对 URL）
export default defineConfig({
  site: 'https://arclink-placeholder.example',
  output: 'static',
  // 双语由页面自身的 getStaticPaths 显式生成（一个源文件 → /page 与 /zh/page）；
  // 不用 fallback：它会为已存在的 zh 页再镜像一层 /zh/zh/*
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
    }),
  ],
});
