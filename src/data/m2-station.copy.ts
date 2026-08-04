// M2 变体 B — 地面站（Station）叙事文案字典（en/zh 同构键）
// 仅收叙事串；mono 编号语言（MOD./STG./CAP./IND. 编号、城市代码、KM/UTC/坐标/时间戳）不进字典、不翻译（docs/10 调性设计）
// 模板占位符 {n}/{asOf}/{km}/{from}/{to} 由 StationPage.astro 在构建时替换

export type StationLocale = 'en' | 'zh';

export interface StationCopy {
  pageTitle: string;
  hero: {
    /** 两行大字标 */
    title: readonly [string, string];
    cue: string;
    /** globe 角注的叙事半句（节点数 mono 部分由组件拼） */
    globeTagLegend: string;
  };
  telemetry: {
    title: string;
    /** 与 coverage.ts metrics 三项一一对应（顺序锁死） */
    specs: readonly { label: string; unit: string }[];
    sparkLabel: string; // {n}
    sparkSum: string; // {km}
    note: string; // {asOf} {n}
  };
  interstice1: { line: string; cap: string }; // cap: {asOf}
  pipeline: {
    title: string;
    sub: string; // {from} {to}
    /** STG-01..03 卡片正文（编号头不进字典） */
    stages: readonly [string, string, string];
  };
  interstice2: { line: string; cap: string };
  coverage: {
    title: string;
    /** 与组件 regions 数组顺序锁死：all / sea / mea / latam */
    regions: readonly [string, string, string, string];
    readouts: { nodes: string; deliveries: string; km: string };
    consoleTag: string;
    consoleNote: string; // {n} {asOf}
    ctaPrimary: string;
    ctaSecondary: string;
  };
  /** MOD-05：标题 + 交互注脚；副文案取自 home platform.description */
  capabilities: { title: string; hint: string };
  /** MOD-06：标题 + 交互注脚；副文案取自 home industries.heading */
  sectors: { title: string; hint: string };
  /** 第三幕间（belief.manifesto 三句取自 home）的 mono 注脚 */
  manifestoCap: string;
}

export const stationCopy: Record<StationLocale, StationCopy> = {
  en: {
    pageTitle: 'M2 · Station — ARCLINK',
    hero: {
      title: ['Ground truth,', 'delivered.'],
      cue: 'SCROLL — TELEMETRY BELOW ▾',
      globeTagLegend: 'MARKERS = COVERAGE CITIES',
    },
    telemetry: {
      title: 'Readings, not claims.',
      specs: [
        { label: 'CITIES COVERED', unit: 'UNIQUE NODES' },
        { label: 'COUNTRIES', unit: 'ACTIVE MARKETS' },
        { label: 'TASKS COMPLETED', unit: 'TOTAL · NOT UNIQUE' },
      ],
      sparkLabel: 'KM / DELIVERY · LAST {n}',
      sparkSum: 'Σ {km} KM VERIFIED',
      note: 'AS OF {asOf} · CITIES = UNIQUE NODES WITH ≥1 VERIFIED DELIVERY · TASKS = CUMULATIVE COMPLETED · KM = SUM OF LAST {n} DELIVERY RECORDS',
    },
    interstice1: {
      line: 'Every reading on this screen happened.',
      cap: 'NO SYNTHETIC DATA · SOURCE: DELIVERY LOG · {asOf}',
    },
    pipeline: {
      title: 'From ground to guarantee.',
      sub: 'One real delivery, traced end to end — collected in {from}, verified in transit, delivered to {to}.',
      stages: [
        'Local teams capture structured field data where it happens — no remote guesswork.',
        'Every record is cross-checked, geo-stamped and time-signed before it counts.',
        'Verified results land in your pipeline with the audit trail attached.',
      ],
    },
    interstice2: {
      line: 'Trust is a measurement.',
      cap: 'HOVER ANY POINT OR ARC FOR ITS RECORD',
    },
    coverage: {
      title: "Point at a region. We're on it.",
      regions: ['ALL REGIONS', 'SOUTHEAST ASIA', 'MIDDLE EAST & AFRICA', 'LATIN AMERICA'],
      readouts: { nodes: 'NODES', deliveries: 'DELIVERIES', km: 'VERIFIED KM' },
      consoleTag: 'EQUIRECTANGULAR · 30° GRID · DOT = CITY / ARC = DELIVERY',
      consoleNote: 'WINDOW: LAST {n} RECORDS · AS OF {asOf}',
      ctaPrimary: 'REQUEST COVERAGE',
      ctaSecondary: 'JOIN NETWORK',
    },
    capabilities: {
      title: 'One platform. Six instruments.',
      hint: 'HOVER A UNIT — ITS ARCFIELD RUNS · SEED = UNIT TITLE',
    },
    sectors: {
      title: 'Indexed by industry.',
      hint: 'HOVER / FOCUS A ROW FOR ITS INDEX RECORD',
    },
    manifestoCap: 'OUR BELIEF · MANIFESTO · 03 STATEMENTS',
  },
  zh: {
    pageTitle: 'M2 · 地面站 — ARCLINK',
    hero: {
      title: ['地面实况，', '如约交付。'],
      cue: '向下滚动 — 遥测读数在下方 ▾',
      globeTagLegend: '标记 = 覆盖城市',
    },
    telemetry: {
      title: '只给读数，不给口号。',
      specs: [
        { label: '覆盖城市', unit: '唯一节点' },
        { label: '覆盖国家', unit: '活跃市场' },
        { label: '完成任务', unit: '累计 · 非去重' },
      ],
      sparkLabel: 'KM / 单次交付 · 最近 {n} 条',
      sparkSum: 'Σ {km} KM · 已核验',
      note: 'AS OF {asOf} · 城市 = 至少一条核验交付的唯一节点 · 任务 = 累计完成数 · KM = 最近 {n} 条交付记录之和',
    },
    interstice1: {
      line: '这块屏幕上的每个读数，都真实发生过。',
      cap: '无合成数据 · 来源：交付日志 · {asOf}',
    },
    pipeline: {
      title: '从地面，到保证。',
      sub: '一条真实交付，端到端追踪——{from} 采集，途中核验，送达 {to}。',
      stages: [
        '本地团队在现场采集结构化实地数据——不做远程臆测。',
        '每条记录在计入之前，都经过交叉核验、地理签章与时间签名。',
        '核验完成的结果连同完整审计链路，一并进入你的数据管线。',
      ],
    },
    interstice2: {
      line: '信任，是一种测量。',
      cap: '悬停任意点或弧线，查看它的原始记录',
    },
    coverage: {
      title: '指向一个区域，我们就在那里。',
      regions: ['全部区域', '东南亚', '中东与非洲', '拉丁美洲'],
      readouts: { nodes: '节点', deliveries: '交付', km: '核验 KM' },
      consoleTag: '等距圆柱投影 · 30° GRID · 点 = 城市 / 弧 = 交付',
      consoleNote: '窗口：最近 {n} 条记录 · AS OF {asOf}',
      ctaPrimary: '请求覆盖',
      ctaSecondary: '加入网络',
    },
    capabilities: {
      title: '一个平台，六台仪器。',
      hint: '悬停任一仪器——弧场随即运转 · 种子 = 仪器名',
    },
    sectors: {
      title: '按行业检索。',
      hint: '悬停或聚焦任意行，展开该行业的索引记录',
    },
    manifestoCap: '我们的信念 · MANIFESTO · 03 句',
  },
} as const;
