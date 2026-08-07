# 09 · 设计系统（品牌色 / 组件 / 风格的单一事实来源索引）

> 代码中的权威定义是 `src/styles/tokens.css`（变量）与 `src/components/ui/`（组件）；本文档是人类可读的汇总与决策记录。更新：2026-08-04。
> **站点调性已定（docs/10）**：勘测年鉴融合版——其宣言与"字体宪法/三图元宪法/proof-of-life/弧场引擎"是本设计系统的上位规则。

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

---

# 使用规范（2026-08-07 · 设计系统治理评审定稿）

> 回答"什么情况用什么颜色/交互/组件"。新增代码必须先对表；改表须经 samuel 拍板。
> （注：本文之上的 i18n/双语段落属 v0.2 之前的历史方案，现行站点为英文单语。）

## A. 颜色

| # | 场景 | 规则 |
|---|---|---|
| 1 | `--color-accent` #2563eb | 浅底的一切功能蓝：文字链、eyebrow、选中态（chip/tab/industry）、控件焦点边、primary 渐变终点 |
| 2 | `--color-accent-bright` #3478ff | 深底的一切功能蓝：深底 eyebrow、h1 强调行、导航下划线、深底描边/辉光、深底焦点环；浅底 UI 层禁止（图形光效豁免见 #6） |
| 3 | eyebrow（品牌蓝大写） | 仅作区块标题前导，**每区最多一个、必须紧邻 h1/h2**；字段/信息组标签一律用灰 `.micro-label` |
| 4 | `--color-accent-deep` | 仅存在于 primary 渐变起点与发光滤镜；禁止单独作文字/描边 |
| 5 | `--color-danger` 族 | 仅错误反馈（边框/文字/焦点环/toast-error）；永不用于品牌表达 |
| 6 | 图形豁免 | hero canvas / 网络图的光效色带与浅底 bright 填充属"光源隐喻"层，允许；UI 层（文字/描边/控件）无豁免 |
| 7 | 灰阶（深底） | 区块引导文 = muted-on-dark；卡内正文/页脚/次要 = soft-on-dark |
| 8 | 灰阶（浅底） | 辅助文字只有 muted-on-light 一档；正文用 text-on-light（法律页示范） |
| 9 | 线 | `--hairline*` = 内容内分隔线（页脚分组/文档题区）；`--color-border-on-*` = 组件外轮廓；蓝线一律 `rgba(var(--color-accent-rgb), var(--alpha-line))` |
| 10 | 蓝浓度档 | 底色反馈 `--alpha-bg-hover`(.1)；焦点环 `--alpha-ring`(.18)；图形线 `--alpha-line`(.28)。禁止散写 alpha |

## B. 交互

| # | 场景 | 规则 |
|---|---|---|
| 1 | hover 位移 | 仅 0 / -2px：0 = 持久选中态与纯展示卡（不承诺可点就不做位移）；-2 = 按钮、行级条目、返回链接。（-4 档已随"展示卡去位移"废止） |
| 2 | hover 颜色反馈 | 浅底：底色 → tint 或 rgba(accent, bg-hover)；深底：描边 → bright 系 + 底色渐变提亮 |
| 3 | 辉光 | 仅 primary 按钮（glow-accent→strong）与深底发光图形；outline 系与浅底卡禁止辉光 |
| 4 | 时长五档 | fast .22 = 颜色/小位移；base .3 = 卡 hover/header 变底；panel .32 = 弹窗/tab/手风琴/toast 进出场；reveal .7 = 滚动入场；ambient .9 = 首屏叙事。禁止新增字面量 |
| 5 | 焦点 | 浅底 accent、深底 bright 的 2px outline；primary 按钮上用白环+底色隔离圈；表单控件豁免为"边框变色+3px 光环" |
| 6 | active 按压 | 按钮统一 translateY(0) + 0.08s |
| 7 | 箭头微动 | primary 的 → hover 右移 3px；journey-back 的 ← hover 左移 2px |

## C. 组件

| # | 组件 | 使用边界 |
|---|---|---|
| 1 | button-primary | 每屏幕区域最多一个的转化动作；唯一允许带 `→` |
| 2 | button-outline / outline-dark | 深底 / 浅底的次级动作，不带箭头 |
| 3 | button-large | 仅 hero 与页尾收口 CTA |
| 4 | 卡片 | 容器卡 = radius-md + 1px 描边（深底另加顶缘高光+上亮下暗表层）；控件 = radius-sm；chip = 999px 胶囊 |
| 5 | eyebrow / micro-label / mono-caption | 区块前导（蓝）/ 信息组标签（灰）/ 事实数据（mono：编号、坐标、计数、404 码） |
| 6 | 选择器语言 | 选中态 = accent 变色 + 下缘 2px 线（Industries 与 /join tab 同语言）；不再发明第三种 |
| 7 | icon | 全站 icon 集 = 线性 SVG（16 网格 / stroke 1.5 / currentColor）：chevron（导航）、plus 旋 45°=关闭（弹窗/手风琴）、平台 5 卡语义 icon；流程数字、行业编号、联系信息保持纯排版；→/← 保留 Inter 字符 |
| 8 | 禁用态 | 中性化（tint 底 + muted 字），禁止半透明品牌色；"提交中"独立态（保持品牌渐变 + spinner） |
| 9 | toast | 成功 = 品牌深蓝 + accent 边 + ✓，6.5s 自动退场；失败 = danger 渐变 + ! + 常驻可关，文内邮箱必须 mailto 可点 |
