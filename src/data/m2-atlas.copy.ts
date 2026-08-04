// M2 变体 A「勘测年鉴」双语文案字典 — 仅叙事文案（标题/正文/CTA/注脚/caption 的叙事部分）
// mono 编号语言不进字典、不翻译：SEC./FIG./IDX./PH./CAP./IND. 编号、城市代码、KM/UTC/坐标/时间戳（docs/10 字体宪法）
// 原型正式文案（hero/platform/industries/belief）从 home.ts / home.zh.ts 引入，保持单一来源
// 占位符：字符串中的 {n} {r} {m} 由组件用 fmt() 注入构建时数字
import { hero as heroEn, belief as beliefEn, platform as platformEn, industries as industriesEn } from './home';
import { hero as heroZh, belief as beliefZh, platform as platformZh, industries as industriesZh } from './home.zh';

// 弧场生成器种子必须双语一致（同种子同输出）：能力用英文 title、行业用英文 key 做种子
const featureSeeds = platformEn.features.map((f) => f.title);

export interface AtlasCopy {
  meta: { title: string; description: string };
  hero: { deck: string; jump: string; logTitle: string };
  index: { title: string; lede: string; rows: { label: string; note: string }[]; footnote: string };
  method: { title: string; lede: string; phases: string[] };
  coverage: {
    title: string;
    lede: string;
    consoleTitle: string;
    regions: Record<'all' | 'sea' | 'me' | 'africa' | 'latam', string>;
    readouts: { region: string; nodes: string; records: string; km: string; last: string };
    pointer: string;
  };
  capabilities: { title: string; lede: string; note: string; features: { title: string; description: string; seed: string }[] };
  industries: { title: string; lede: string; items: { key: string; label: string; description: string }[] };
  manifesto: { lines: string[] };
  cta: { title: string; sub: string; button: string };
  aria: {
    globe: string;
    mapFallback: string;
    log: string;
    ticks: string;
    methodFig: string;
    plate: string;
    console: string;
    regionGroup: string;
    record: string;
    node: string;
    industriesList: string;
  };
}

const en: AtlasCopy = {
  meta: { title: 'M2 · Atlas — ARCLINK', description: heroEn.description },
  hero: {
    deck: heroEn.description,
    jump: 'SEC.03 — Open the coverage plate ↓',
    logTitle: 'LOG — Delivery records',
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
    note: 'Hover a plate to draw its arcfield signature — every figure is generated, seeded by the module title',
    features: platformEn.features.map((f, i) => ({ title: f.title, description: f.description, seed: featureSeeds[i] })),
  },
  industries: {
    title: 'Indexed by industry.',
    lede: `${industriesEn.heading} Hover or focus a row to open its file.`,
    items: industriesEn.items.map((it) => ({ key: it.key, label: it.label, description: it.description })),
  },
  manifesto: { lines: [...beliefEn.manifesto] },
  cta: {
    title: 'The atlas grows every day.',
    sub: 'Add your city to the next edition — coverage begins with a single brief.',
    button: 'Request coverage',
  },
  aria: {
    globe: 'Rotating globe plotting {n} Arclink node cities',
    mapFallback: 'Map of {n} Arclink node cities',
    log: 'Published delivery records',
    ticks: 'Kilometres per delivery record, {r} records, maximum {m} kilometres',
    methodFig: 'Method diagram: collect, verify, deliver — connected by two arcs labelled raw trace and verified packet',
    plate: 'Operable coverage plate: {n} node cities and {r} delivery records on an equirectangular graticule',
    console: 'Coverage console',
    regionGroup: 'Filter coverage by region',
    record: 'Delivery record: ',
    node: 'Node city: ',
    industriesList: 'Industry index',
  },
};

const zh: AtlasCopy = {
  meta: { title: 'M2 · 年鉴 — ARCLINK', description: heroZh.description },
  hero: {
    deck: heroZh.description,
    jump: 'SEC.03 — 打开覆盖图版 ↓',
    logTitle: 'LOG — 交付记录',
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
    note: '悬停任一图版即描画其弧场签名——所有图形皆由生成器产出，种子为模块英文名',
    features: platformZh.features.map((f, i) => ({ title: f.title, description: f.description, seed: featureSeeds[i] })),
  },
  industries: {
    title: '按行业归档。',
    lede: `${industriesZh.heading}悬停或聚焦任意一行，即可调出该行业的档案。`,
    items: industriesZh.items.map((it) => ({ key: it.key, label: it.label, description: it.description })),
  },
  manifesto: { lines: [...beliefZh.manifesto] },
  cta: {
    title: '这本图集，每天都在生长。',
    sub: '把你的城市加入下一版——覆盖，从一份需求简报开始。',
    button: '请求覆盖',
  },
  aria: {
    globe: '旋转地球，标绘 {n} 座 Arclink 节点城市',
    mapFallback: '{n} 座 Arclink 节点城市地图',
    log: '已发表交付记录',
    ticks: '每条交付记录的公里数，共 {r} 条，最大 {m} 公里',
    methodFig: '方法图：采集、核验、交付——由标注 RAW TRACE 与 VERIFIED PACKET 的两条弧线相连',
    plate: '可操作覆盖图版：等距圆柱经纬网上 {n} 座节点城市与 {r} 条交付记录',
    console: '覆盖台',
    regionGroup: '按区域筛选覆盖',
    record: '交付记录：',
    node: '节点城市：',
    industriesList: '行业索引',
  },
};

export const atlasCopy = { en, zh } as const;
