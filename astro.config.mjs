import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// 注意：站点域 arclink-solutions.com（带 s）≠ 邮箱域 arclink-solution.com（不带 s），见 docs/05
export default defineConfig({
  site: 'https://arclink-solutions.com',
  output: 'static',
  // 静态页照旧预渲染；仅 /api/forms/*（prerender=false）走 Worker（docs/03）
  adapter: cloudflare(),
  // 站点为英文单语（v0.2 需求：面向海外用户，全英文）
  integrations: [react(), sitemap()],
});
