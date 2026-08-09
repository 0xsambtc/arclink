// 构建期生成地理精确点阵底图（dotted-map，diagonal 交错网格）+ 城市吸附格点坐标
// 产出 src/data/world-dots.ts；运行时零依赖。用法：node scripts/gen-dotted-map.mjs
import DottedMap from 'dotted-map';
import { writeFileSync } from 'node:fs';

// 顺序与 Hero.astro 的 CITIES 严格一致（hub 标记留在引擎侧）
const CITIES = [
  ['Singapore', 1.35, 103.82], ['Kuala Lumpur', 3.14, 101.69], ['Jakarta', -6.2, 106.85],
  ['Bangkok', 13.76, 100.5], ['Manila', 14.6, 120.98], ['Ho Chi Minh City', 10.82, 106.63],
  ['Guangzhou', 23.13, 113.26], ['Tokyo', 35.68, 139.69], ['Seoul', 37.57, 126.98],
  ['Sydney', -33.87, 151.21], ['Mumbai', 19.08, 72.88], ['Dubai', 25.2, 55.27],
  ['London', 51.51, -0.13], ['Berlin', 52.52, 13.4], ['San Francisco', 37.77, -122.42],
  ['New York', 40.71, -74.01], ['São Paulo', -23.55, -46.63], ['Nairobi', -1.29, 36.82],
];

const map = new DottedMap({ height: 84, grid: 'diagonal' });
for (const [name, lat, lng] of CITIES) map.addPin({ lat, lng, data: name });
const pts = map.getPoints();

let maxX = 0, maxY = 0;
for (const p of pts) { if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y; }
const dots = [];
const cityXY = new Array(CITIES.length).fill(null);
for (const p of pts) {
  const nx = +(p.x / maxX).toFixed(4);
  const ny = +(p.y / maxY).toFixed(4);
  if (p.data) cityXY[CITIES.findIndex(c => c[0] === p.data)] = [nx, ny];
  else dots.push(nx, ny);
}
if (cityXY.some(c => !c)) throw new Error('city pin missing');

const src = `// 由 scripts/gen-dotted-map.mjs 生成（dotted-map diagonal 网格，height=64），勿手改
// dots: 归一化 [x,y] 扁平数组；CITY_XY 与 Hero 的 CITIES 同序、已吸附格点
export const DOT_MAP = {
  aspect: ${(maxX / maxY).toFixed(4)},
  dots: new Float32Array([${dots.join(',')}]),
  cityXY: ${JSON.stringify(cityXY)} as ReadonlyArray<readonly [number, number]>,
};
`;
writeFileSync('src/data/world-dots.ts', src);
console.log('dots:', dots.length / 2, 'aspect:', (maxX / maxY).toFixed(3), '→ src/data/world-dots.ts');
