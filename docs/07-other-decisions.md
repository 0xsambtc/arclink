# 07 · 其他决策项

> 各项独立，均给出默认答案；标 ⏳ 的需要 samuel 确认或后续触发。

## 1. 域名 ⏳

- 建议 `.com` 优先（enterprise 采购方的信任惯性）；Cloudflare Registrar 成本价注册顺带解决 DNS。
- **待确认**：与阿里企业邮箱绑定的域名是否同一个（影响 DNS 协调方式，见 [05](05-email-notification.md)，不影响架构）。

## 2. 反垃圾

**已定**：Cloudflare Turnstile（免费、无谷歌依赖、对海外访客体验好）+ 表单 honeypot 隐藏字段，双保险。不用 reCAPTCHA。

## 3. 内容管理（CMS）

**已定：不上 CMS。** 内容流程是"PM 给框架 → samuel 把关 → AI 辅助改代码"，Astro 的 content collections/组件数据就是 CMS；改内容 = 改文件 + git push 自动发布（还有 preview URL 给 PM 审）。触发重新评估的条件：出现"非技术同事需要频繁自主改文案"时，再考虑 git-based CMS（Decap/Keystatic）。现在上是过度设计。

## 4. SEO / 分享基建

一次性配好：sitemap、canonical、meta description、**OG 分享图**（采购方在 Slack/邮件里转发链接时的卡片颜值，值得专门做一张）、favicon 全套。Astro 生态均有现成集成。行业垂类关键词（geospatial data collection / field data collection 等）等 PM 内容定稿后再做页面级优化。

## 5. 合规页面

Privacy Policy + Terms 两个静态页——海外企业采购流程里法务可能真的会看，缺了减分。因为分析用无 cookie 的 Cloudflare Web Analytics，**可以不放 cookie banner**，页面更干净。表单处收集个人信息（姓名/邮箱/IP），Privacy Policy 里如实披露用途。

## 6. 监控告警

**已定**：UptimeRobot 免费版盯站点存活 + 函数内下游失败（多维表格写入/邮件发送）触发 IM 机器人告警。表单静默失败是本项目最大风险，此条不省。上线后第一周每天真实提交自测一次。

## 7. 品牌资产

logo SVG 化（原型里已有节点-弧线 logo 的 CSS 实现，转正式 SVG）、favicon、OG 图、邮件签名用的小尺寸 logo。小事但直接影响"像不像正规公司"。

## 8. 未来预留（不做，只记录触发条件）

| 事项 | 触发条件 |
|---|---|
| 中文版（Astro i18n 路由已预留） | 出现国内采购方线索 |
| 可搜索 coverage 页（Hivemapper 式） | 真实覆盖数据积累起来 |
| 自建后端 + 数据库迁移（见 [04](04-storage.md)/[03](03-form-backend.md)） | 采集人员需要登录/审核流/任务分发 |
| EdgeOne `cn.` 入口 | 实测有买家从大陆访问且慢 |
| SMTP 级邮箱验证 API | 垃圾/无效提交多到前三层拦不住 |
