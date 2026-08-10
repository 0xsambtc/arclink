import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// 站点与邮箱同域 arclink-solutions.com（PM 材料曾误写无 s，勘误见 docs/TODO.md）
export default defineConfig({
  site: 'https://arclink-solutions.com',
  output: 'static',
  // 静态页照旧预渲染；仅 /api/forms/*（prerender=false）走 Worker（docs/03）
  adapter: cloudflare(),
  // 站点为英文单语（v0.2 需求：面向海外用户，全英文）
  // sitemap 带 lastmod（取构建时间：CI 为 git-first，push 即构建，约等于内容更新时刻）
  // 仅加 lastmod——Google 明确忽略 priority/changefreq，加了是噪音
  integrations: [sitemap({ lastmod: new Date() })],
});
