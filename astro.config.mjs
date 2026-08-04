import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: 域名到位后替换 site（影响 sitemap/canonical 的绝对 URL）
export default defineConfig({
  site: 'https://arclink-placeholder.example',
  output: 'static',
  // i18n 配置层：en 默认无前缀；zh 已声明并 fallback 重定向到 en——
  // 中文内容到位时新增 src/pages/zh/ + 对应数据文件即可覆盖 fallback（docs/02）
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    fallback: { zh: 'en' },
    routing: { prefixDefaultLocale: false, fallbackType: 'redirect' },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
    }),
  ],
});
