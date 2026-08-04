// M2 变体 A「勘测年鉴」双语文案字典 — 仅叙事文案（标题/正文/CTA/注脚/caption 的叙事部分）
// mono 编号语言不进字典、不翻译：SEC./FIG./IDX./PH./CAP./IND. 编号、城市代码、KM/UTC/坐标/时间戳（docs/10 字体宪法）
// 原型正式文案（hero/platform/industries/belief）从 home.ts / home.zh.ts 引入，保持单一来源
// 占位符：字符串中的 {n} {r} {m} 由组件用 fmt() 注入构建时数字
import { hero as heroEn, belief as beliefEn, platform as platformEn, industries as industriesEn } from './home';
import { hero as heroZh, belief as beliefZh, platform as platformZh, industries as industriesZh } from './home.zh';

export interface AtlasCopy {
  meta: { title: string; description: string };
  /** hero v3 活体图版：readoutLabel=读出条左端标签；nodeRecords=marker 读出的记录数后缀（{m} 注入）；
      cluster=密集群簇显示模板（{code} 为城市代码 mono 不译，{k} 为近邻数） */
  hero: { deck: string; jump: string; logTitle: string; readoutLabel: string; nodeRecords: string; cluster: string };
  index: { title: string; lede: string; rows: { label: string; note: string }[]; footnote: string };
  /** next：SEC.02 末尾右下 mono 预告行（编号语言不译，叙事词双语） */
  method: { title: string; lede: string; phases: string[]; next: string };
  coverage: {
    title: string;
    lede: string;
    consoleTitle: string;
    regions: Record<'all' | 'sea' | 'me' | 'africa' | 'latam', string>;
    readouts: { region: string; nodes: string; records: string; km: string; last: string };
    pointer: string;
  };
  /** 能力区无图形 —— 纯排版卡（不设 note 出处语与 seed 字段） */
  capabilities: { title: string; lede: string; features: { title: string; description: string }[] };
  industries: { title: string; lede: string; items: { label: string; description: string }[] };
  manifesto: { lines: string[] };
  cta: { title: string; sub: string; button: string };
  /** 印张 chrome 的 mono 标注（编号语言不译：en/zh 引用同一常量） */
  press: {
    wordmark: string;
    /** hero v3：FIG.02 活体外业图版图注头标题（{n} = 节点数） */
    liveplate: string;
    /** FIG.02 caption 的 marker 含义标注 */
    markerNote: string;
    stamp: string;
    spread: string;
    megaSuffix: string;
    methodMarginalia: string;
    detach: string;
    railHead: string;
  };
  aria: {
    globe: string;
    mapFallback: string;
    /** hero v3：投影 DOM 覆盖拾取层（12 个可聚焦城市按钮）的 group 标签，{n} 注入 */
    nodeGroup: string;
    log: string;
    ticks: string;
    methodFig: string;
    plate: string;
    console: string;
    regionGroup: string;
    record: string;
    node: string;
    industriesList: string;
    stock: string;
  };
}

// 印张 chrome mono 标注（docs/10 字体宪法：编号语言不翻译 — en/zh 共用同一常量，防止双语漂移）
// FIG 编号（仅 5 个真图形，见 docs/11）：FIG.01 字标图版 / FIG.02 档案地球 /
// FIG.03 每记录公里（SEC.01 行内）/ FIG.04 方法管线 / FIG.05 覆盖跨页
const pressMono = {
  wordmark: 'FIG.01 — WORDMARK PLATE · 12 DELIVERY ARCS SET IN THE NAME',
  // hero v3：FIG.02 = 全宽活体外业图版（球格 + 日志 + 读出条同框）
  liveplate: 'FIG.02 — LIVE FIELD PLATE · {n} NODES',
  markerNote: 'MARKERS = NODE CITIES ({n})',
  // 归档为原位收缩，不设 PLATE SLOT（RECEIVING）键；stamp 盖在 hero 图框角
  stamp: 'ARCHIVED — FIG.02 · AS OF {d}',
  spread: 'FIG.05 — COVERAGE SPREAD · EQUIRECTANGULAR · GRATICULE 30°',
  megaSuffix: 'TOTAL RECORD KM',
  methodMarginalia: 'RAW TRACE → VERIFIED PACKET · ONE CONTRACT',
  detach: 'DETACH — RETURN TO ARCLINK',
  railHead: 'ARCLINK ANNUAL — EDITION 2026',
} as const;

const en: AtlasCopy = {
  meta: { title: 'M2 · Atlas — ARCLINK', description: heroEn.description },
  hero: {
    deck: heroEn.description,
    jump: 'SEC.03 — Open the coverage plate ↓',
    logTitle: 'LOG — Delivery records',
    readoutLabel: 'READOUT',
    nodeRecords: '{m} RECORDS',
    cluster: '{code} +{k} NEARBY',
  },
  index: {
    title: 'The network, counted.',
    lede: 'No projections, no rounded-up market claims. The index below is the network as it stands — each count traceable to the records published in this edition.',
    rows: [
      { label: 'Node cities', note: 'Distinct metros with active field teams' },
      { label: 'Countries', note: 'Operating jurisdictions, current edition' },
      { label: 'Tasks completed', note: 'Cumulative verified close-outs' },
      { label: 'Record kilometres', note: 'Sum of {n} published delivery records' },
    ],
    footnote: 'Counts are published records, not projections · Methodology: SEC.02',
  },
  method: {
    title: 'Collected. Verified. Delivered.',
    lede: 'Three phases, one contract: nothing enters the atlas that cannot be traced back to a field capture.',
    phases: [
      'Local field teams capture ground truth on-site — position, evidence and timestamps bound into a single trace.',
      'Every trace is cross-checked against a second source before it is allowed to enter the atlas. No match, no record.',
      'Verified packets are handed over with a signed manifest — the same record you can audit on this page.',
    ],
    // SEC.03 反色跨页的物理预告（PLATE V = FIG.05 覆盖跨页）
    next: 'NEXT — PLATE V / COVERAGE',
  },
  coverage: {
    title: 'One plate, operable.',
    lede: 'Select a region to re-read the plate. Every point is a node city, every arc is one published delivery record — hover or focus any primitive for its source.',
    consoleTitle: 'Coverage console — select region',
    regions: {
      all: 'All regions',
      sea: 'Southeast Asia',
      me: 'Middle East',
      africa: 'Africa',
      latam: 'Latin America',
    },
    readouts: { region: 'Region', nodes: 'Nodes', records: 'Records', km: 'Distance', last: 'Last record' },
    pointer: 'Pointer readout',
  },
  capabilities: {
    title: 'Six instruments, one platform.',
    lede: platformEn.description,
    // 能力区无图形 —— 纯排版卡，不设 note 出处语
    features: platformEn.features.map((f) => ({ title: f.title, description: f.description })),
  },
  industries: {
    title: 'Indexed by industry.',
    // 描述常显，不设"悬停调档案"操作说明
    lede: industriesEn.heading,
    items: industriesEn.items.map((it) => ({ label: it.label, description: it.description })),
  },
  manifesto: { lines: [...beliefEn.manifesto] },
  cta: {
    title: 'The atlas grows every day.',
    sub: 'Add your city to the next edition — coverage begins with a single brief.',
    button: 'Request coverage',
  },
  press: pressMono,
  aria: {
    globe: 'Rotating globe plotting {n} Arclink node cities',
    mapFallback: 'Map of {n} Arclink node cities',
    nodeGroup: 'Globe node markers — {n} focusable city points',
    log: 'Published delivery records',
    ticks: 'Kilometres per delivery record, {r} records, maximum {m} kilometres',
    methodFig: 'Method diagram: collect, verify, deliver — connected by two arcs labelled raw trace and verified packet',
    plate: 'Operable coverage plate: {n} node cities and {r} delivery records on an equirectangular graticule',
    console: 'Coverage console',
    regionGroup: 'Filter coverage by region',
    record: 'Delivery record: ',
    node: 'Node city: ',
    industriesList: 'Industry index',
    stock: 'Paper stock — switch between paper and night editions',
  },
};

const zh: AtlasCopy = {
  meta: { title: 'M2 · 年鉴 — ARCLINK', description: heroZh.description },
  hero: {
    deck: heroZh.description,
    jump: 'SEC.03 — 打开覆盖图版 ↓',
    logTitle: 'LOG — 交付记录',
    readoutLabel: '读数',
    nodeRecords: '{m} 条记录',
    // 城市代码 {code} 为 mono 编号语言不译；叙事词「邻近」翻译
    cluster: '{code} +{k} 邻近',
  },
  index: {
    title: '这张网络，逐项清点。',
    lede: '没有预测，也没有凑整的市场话术。下方的索引就是网络的现状——每一项计数，都可追溯到本版发表的记录。',
    rows: [
      { label: '节点城市', note: '拥有活跃外业团队的独立都会区' },
      { label: '国家', note: '本版覆盖的运营辖区' },
      { label: '已完成任务', note: '累计已核验的任务关单' },
      { label: '记录公里数', note: '{n} 条已发表交付记录之和' },
    ],
    footnote: '各项计数均为已发表记录，非预测 · 方法见 SEC.02',
  },
  method: {
    title: '采集。核验。交付。',
    lede: '三个阶段，一条契约：凡是无法追溯到一次实地采集的，都进不了这本图集。',
    phases: [
      '本地外业团队在现场采集地面真值——位置、证据与时间戳，绑定为同一条轨迹。',
      '每条轨迹都要与第二来源交叉核对，才被允许写入图集。对不上号，就不成记录。',
      '核验通过的数据包随签名清单一并交付——也就是你在本页可以查验的同一份记录。',
    ],
    // 编号语言（NEXT/PLATE V）不译，叙事词"覆盖跨页"翻译
    next: 'NEXT — PLATE V / 覆盖跨页',
  },
  coverage: {
    title: '一张图版，可以操作。',
    lede: '选择一个区域，重新读这张图版。每个点是一座节点城市，每条弧是一条已发表的交付记录——悬停或聚焦任一图元，即见其出处。',
    consoleTitle: '覆盖台 — 选择区域',
    regions: {
      all: '全部区域',
      sea: '东南亚',
      me: '中东',
      africa: '非洲',
      latam: '拉丁美洲',
    },
    readouts: { region: '区域', nodes: '节点', records: '记录', km: '里程', last: '最新记录' },
    pointer: '指针读数',
  },
  capabilities: {
    title: '六件仪器，一个平台。',
    lede: platformZh.description,
    // 能力区无图形 —— 纯排版卡，不设 note 出处语
    features: platformZh.features.map((f) => ({ title: f.title, description: f.description })),
  },
  industries: {
    title: '按行业归档。',
    // 描述常显，不设"悬停调档案"操作说明
    lede: industriesZh.heading,
    items: industriesZh.items.map((it) => ({ label: it.label, description: it.description })),
  },
  manifesto: { lines: [...beliefZh.manifesto] },
  cta: {
    title: '这本图集，每天都在生长。',
    sub: '把你的城市加入下一版——覆盖，从一份需求简报开始。',
    button: '请求覆盖',
  },
  press: pressMono,
  aria: {
    globe: '旋转地球，标绘 {n} 座 Arclink 节点城市',
    mapFallback: '{n} 座 Arclink 节点城市地图',
    nodeGroup: '地球节点标记——{n} 个可聚焦城市点',
    log: '已发表交付记录',
    ticks: '每条交付记录的公里数，共 {r} 条，最大 {m} 公里',
    methodFig: '方法图：采集、核验、交付——由标注 RAW TRACE 与 VERIFIED PACKET 的两条弧线相连',
    plate: '可操作覆盖图版：等距圆柱经纬网上 {n} 座节点城市与 {r} 条交付记录',
    console: '覆盖台',
    regionGroup: '按区域筛选覆盖',
    record: '交付记录：',
    node: '节点城市：',
    industriesList: '行业索引',
    stock: '纸样切换——在纸面版与夜航版之间切换',
  },
};

export const atlasCopy = { en, zh } as const;
