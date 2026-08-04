// 弧场生成器 — 全站唯一图形引擎（docs/10 共同骨架第 4 条）
// 原则（stripe.dev 模式）：图形不是画出来的，是"同一套规则 + 真实数据种子"生成的；
// 同种子同输出（确定性），图形可复现是"系统性"的前提。输出 SVG path 字符串，渲染端自由。

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 两点间二次贝塞尔弧（lift 为拱高系数，正负决定拱向） */
export function arcBetween(x1: number, y1: number, x2: number, y2: number, lift = 0.22): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * lift;
  const cy = my + dx * lift;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export interface ArcfieldOptions {
  width: number;
  height: number;
  count?: number;
  amplitude?: number;
  seed: string; // 真实数据种子：城市名 / 行业 ID / 任务数……
}

/** 由种子生成一族同源弧线 —— 装饰性图形的唯一合法来源 */
export function generateArcfield({ width, height, count = 9, amplitude = 0.25, seed }: ArcfieldOptions): string[] {
  const rand = mulberry32(hashString(seed));
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const x1 = rand() * width * 0.4;
    const y1 = height * (0.25 + rand() * 0.6);
    const x2 = width * (0.55 + rand() * 0.45);
    const y2 = height * (0.15 + rand() * 0.6);
    paths.push(arcBetween(x1, y1, x2, y2, amplitude * (0.6 + rand() * 0.8)));
  }
  return paths;
}

/** 等距圆柱投影：经纬度 → 平面坐标（平面点阵地图与弧线定位用） */
export function project(lat: number, lng: number, width: number, height: number): [number, number] {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}
