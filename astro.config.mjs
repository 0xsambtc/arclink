import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: 域名到位后替换 site（影响 sitemap/canonical 的绝对 URL）
export default defineConfig({
  site: 'https://arclink-placeholder.example',
  output: 'static',
  // i18n 配置层：en 默认无前缀；zh 已声明并 fallback 重定向到 en——
  // 中文内容到位时新增 src/pages/zh/ + 对应数据文件即可覆盖 fallback（docs/02）
  // 旧设计候选路径的兼容跳转（外部已分享的链接不断）；正式上线前可清理
  redirects: {
    '/m2/atlas': '/atlas',
    '/m2/atlas-paper': '/atlas',
    '/m2/station': '/station',
    '/zh/m2/atlas': '/zh/atlas',
    '/zh/m2/atlas-paper': '/zh/atlas',
    '/zh/m2/station': '/zh/station',
  },
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
