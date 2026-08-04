# 09 · 设计系统（品牌色 / 组件 / 风格的单一事实来源索引）

> 代码中的权威定义是 `src/styles/tokens.css`（变量）与 `src/components/ui/`（组件）；本文档是人类可读的汇总与决策记录。更新：2026-08-04。

## 一、品牌色

### Logo 原色（2026-08-04 自 logo 源文件 `public/brand/arclink-logo.png` 采样）

| 色 | 值 | Token |
|---|---|---|
| 藏青字标（ink） | `#0a1d33` | `--color-brand-ink` |
| 弧线/方点蓝 | `#147dfd`（渐变约 `#0a69fd–#1881fd`） | `--color-brand-blue` |

### UI 三色体系（获奖站配色纪律：不加第四色，docs/01 规律 1）

- **深底**：`--color-bg #030b1d`（页面）/ `--color-bg-navy #06152e` 系（面板）
- **强调蓝**：`--color-accent #2563eb` / `-bright #3478ff` / `-deep #1767ff`
- **白/浅**：`--color-surface #fff` / `-alt` / `-tint`

**Logo 蓝与 UI accent 的关系**：同族不同值（`#147dfd` 略亮偏青）。当前决策是**并存**——logo/favicon 用 brand token，UI 用 accent 族；若日后想完全统一，改 tokens.css 一处即可全站生效。

## 二、排版

- 正文/标题：**Inter Variable**（self-host，`--font-sans`）；大标题紧字距 `--tracking-tight (-0.045em)`
- 机构感辅助：**mono**（`--font-mono`）用于 eyebrow 之外的序号/标签（流程步骤号、行业序号）——Anduril 式
- Eyebrow 规范：全局类 `.eyebrow`（13px / 800 / 大写 / `--tracking-eyebrow 0.17em` / accent-bright）

## 三、空间与形态

- 间距：4px 基 `--space-1..9`（4/8/12/16/24/32/48/64/96）
- 圆角：`--radius-sm 8`（按钮/输入）/ `-md 14`（卡片）/ `-lg 20`（弹窗）
- 深色层级：**1px 描边（`--color-border-on-dark`）+ 顶部内发光**，不用投影（Linear 式）；发光 `--glow-accent(-strong)` 仅用于主按钮
- 动效：`--duration-fast .22s / -base .3s / -reveal .7s`，`--ease-out`；一切动效受 `prefers-reduced-motion` 全局关断

## 四、组件库现状与策略

**已抽取**（`src/components/ui/`）：
- `Button`：variant `primary | outline | outline-dark` × size `base | large`，透传 data-*

**全局模式类**（`global.css`）：`.shell`（版心）/ `.eyebrow` / `.reveal(-delay)`（入场）/ `.text-link` / `.skip-link`

**尚在 section 内、待第二次复用时抽取**（策略：不预建大库，复用出现才抽）：
- Card（Platform 的 feature-card 是范式）
- FormField（ContactModals 内的 label+input 模式）
- SectionHeading（eyebrow+h2 组合）
- Stat/数字（M2 覆盖数字区出现时抽）

**图标策略**：现阶段不用图标库——序号（mono）与极简标记（accent 短横线/圆点）代替（docs/01 升级决策）；真 icon 体系待品牌资产齐备后定。

## 五、风格五规则（评审用检查表，源自 docs/01 调研）

1. 三色纪律，动效再多不加色；
2. 连线/地图绑定真实数据（覆盖城市），拒绝纯装饰；
3. "节点-连线/弧线"母题贯穿（hero/流程/行业复用同一视觉语言）；
4. 章节化滚动 + 每节一个小交互图形，不做整页 WebGL；
5. hero 后立即信任构件（数字/logo wall），case 用数字不用形容词。

## 六、Logo 资产状态

| 资产 | 状态 |
|---|---|
| 浅底横版 logo（PNG） | ✅ `public/brand/arclink-logo.png` |
| favicon（logo 元素派生 SVG） | ✅ `public/favicon.svg`（矢量源到位后可替换为精确标志） |
| **矢量源文件（AI/SVG）** | ⏳ 待提供 |
| **深色底反白版**（header 需要——现深色导航暂用 CSS 字标） | ⏳ 待提供 |

## 七、i18n 结构（配置层已就位，2026-08-04）

- `astro.config.mjs`：`en` 默认无前缀；`zh` 已声明，fallback **重定向**到 en（不产生重复内容）；sitemap 输出 hreflang（en / zh-CN）
- 翻译单元 = 数据文件（`src/data/home.ts` 等），组件零硬编码文案
- **加中文 = 新增 `src/pages/zh/` 页面 + `home.zh.ts`**，覆盖 fallback，无需动任何组件/配置
- 负担分界：配置层零负担（已付）；内容层（zh 文案与 en 同步维护）是真实成本，待英文定稿且确需中文时再付
