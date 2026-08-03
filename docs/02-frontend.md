# 02 · 前端实现方案与取舍

> 状态：✅ 已定 —— Astro 7（output: static）+ React islands + GSAP 3.15 + cobe 2.0。

## 候选对比

| 维度 | **Astro + React islands（已选）** | Next.js 16 | 纯 HTML/CSS/JS |
|---|---|---|---|
| 输出 | 默认零 JS 静态 HTML，交互处按需加载 React island | React runtime + hydration 全页背着（对纯内容站是纯开销） | 无构建管线，无优化 |
| 复用/扩展 | Layout 组件复用；加子页=丢一个 `.astro` 文件；内置 i18n 路由 | 有，但绑 App Router/RSC 心智模型 | 复制粘贴必然漂移；i18n 死路 |
| React 使用 | **官方一等支持**：`<Globe client:visible />` 即真 React 组件，只有它 hydrate | 全程 React | 无 |
| 表单函数同仓 | API endpoints（`prerender = false`）+ 官方 Cloudflare adapter | 有，但部署 Cloudflare 要走 OpenNext 适配层（多一层摩擦） | 靠平台 functions 目录约定 |
| 部署契合 | Cloudflare 官方 adapter | 原生家是 Vercel（商用要 $20/月） | 任意 |

**取舍说明**：samuel 会 React，Next 不是错误选择，真实差异只有两条——① 纯内容站上 Next 的 runtime/hydration 是净开销；② Cloudflare 上 Next 要走 OpenNext。Astro 的 `.astro` 语法≈JSX 超集，上手半天，交互岛屿照写 React，故 Astro 是"最佳实现方式"本身而非技能妥协。纯 HTML 仅作"占位急用"临时态，不持续投入。

## 动效技术栈

- **GSAP 3.15**：已核实 100% 免费含商用（Webflow 收购后），原付费插件 ScrollTrigger/SplitText/DrawSVG/MorphSVG 全部包含（[官方定价页](https://gsap.com/pricing/)）。注意 license 是 Webflow 专有免费许可而非 MIT——对自有官网零影响。
- **cobe 2.0**：hero 地球。关键事实（已核实）：**v2.0（2026-03）起原生支持弧线 API**（`arcs: [{from, to, color}]`），旧资料普遍不知道；13KB min / 5.9KB gzip、零依赖 vanilla JS；`baseColor/glowColor/markerColor/arcColor/dark` 全可调，做深军蓝+电光蓝无障碍（[仓库](https://github.com/shuding/cobe) · [官方示例](https://cobe.vercel.app)：Draggable / Focus Location / Markers & Arcs 均有现成代码）。**坑**：v2 的 CSS Anchor DOM label 在 Safari/Firefox/iOS 有渲染问题（PR #118 未合并），关键信息不放 label。
- **与 ScrollTrigger 的接缝**：只有 cobe 的 `onRender` 一个回调——ScrollTrigger pin/scrub 驱动 proxy 对象（目标经纬度/phi），`onRender` 里读取；分 section 用 Focus Location 逻辑 tween 到目标区域。参考：[Frontend Horse ScrollTrigger 教程](https://frontend.horse/episode/using-threejs-with-gsap-scrolltrigger/)。
- **策略**：原型里已工作的 CSS transition/IntersectionObserver 保留（不为改而改）；新增/升级动效（连线 draw-in、数字 count-up、步骤 pin、标题 SplitText 入场）用 GSAP。
- **不用**：Lenis 平滑滚动（改滚动手感对 B2B 信任场景不加分，留 10 行代码的口子）；Motion/Framer Motion（场景不匹配）。

## 平面地图备选/降级资产

[dotted-map](https://github.com/NTag/dotted-map)（构建期生成点阵 SVG，零运行时）+ SVG bezier 弧线 `stroke-dashoffset` 动画；精确大圆弧才用 d3-geo。**这份静态点阵图同时就是 globe 的降级 fallback**（reduced-motion / 无 WebGL / 低端机）。数据侧：hero 只需 10-30 个覆盖城市，手写 <2KB JSON（`{name, lat, lng, region}`），取数来源 [SimpleMaps World Cities 免费版](https://simplemaps.com/data/world-cities)（MIT）。

## 性能要点

1. **LCP**：`<canvas>` 不是 LCP 候选（web.dev 定义），globe 永远不会"成为"LCP；真实风险是 JS 初始化推迟 H1 文本渲染 → H1 直出不做入场遮挡、globe 用 IntersectionObserver/requestIdleCallback 懒初始化。
2. **深色站防白闪**：根元素内联 `background:#030b1d`。
3. **字体**：Inter 用 Astro 内置 Fonts API self-host（subset + preload 首屏权重 + 自动 metrics fallback 降 CLS），不走 Google CDN；只上 variable 单文件或 400/500/600/700。
4. **reduced-motion**：CSS 全局 `@media (prefers-reduced-motion: reduce)` + GSAP 侧 `gsap.matchMedia()` 注册在 `no-preference` 条件；命中时不初始化 WebGL，直接显示静态点阵图。内容保持可见，不做"隐藏等动画"。
5. **移动端**：cobe 降 `devicePixelRatio: 1` + `mapSamples` 减半；离屏暂停 raf。

## 工程与可维护性约定（以长期维护为标准，samuel 2026-08-03 确认）

1. **Theme 全变量化**：颜色/字号/间距/圆角/阴影/动效时长全部收敛为 CSS custom properties（`--color-*` / `--space-*` / `--font-*` / `--duration-*`），组件只引用变量、禁止硬编码值——调品牌色/加主题/白标均为单点修改；
2. **组件分层**：`src/components/ui/`（通用原子件：Button/Card/SectionHeading/Stat 等）→ `src/components/sections/`（页面段落，只做组装）→ `src/layouts/`；React 交互岛独立 `src/components/islands/`（Globe、表单）。通用件不感知业务内容；
3. **内容与代码分离**：文案、行业、流程步骤、覆盖城市等全部在 `src/content/`（content collections）与 `src/data/`，组件零硬编码文案；
4. **第三方隔离在 adapter 后**：`src/lib/storage.ts`（飞书多维表格实现，接口可换）、`src/lib/mailer.ts`（DirectMail 实现，Resend 可切换）、`src/lib/notify.ts`（飞书群机器人）——换供应商只改一个文件；
5. **TypeScript 全程**，content collections 用 zod schema 校验（内容格式错误构建期报错）；
6. UI 字符串字典化 + URL locale-aware（配合下节 i18n 预留）。

## i18n 预留

英文单语首发（采购方在海外）。Astro 内置 i18n 路由：`locales: ["en","zh"]` + 目录组织 + fallback，未来加中文≈每页复制改文案 + 语言切换组件，一两天工作量。UI 字符串从第一天就抽成字典对象。
