// 从 cobe 内嵌的 256×128 陆地掩码 PNG 生成 hero 点阵地图数据（行程编码）
// 产物：src/data/world-dots.ts —— 运行：node scripts/gen-map-dots.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const src = readFileSync('node_modules/cobe/dist/index.esm.js', 'utf8');
const b64 = src.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)[1];
const png = Buffer.from(b64, 'base64');

// —— 最小 PNG 解码（灰度，任意位深；仅为本掩码服务） ——
let pos = 8;
const chunks = [];
let width = 0;
let height = 0;
let bitDepth = 0;
let colorType = 0;
while (pos < png.length) {
  const len = png.readUInt32BE(pos);
  const type = png.toString('ascii', pos + 4, pos + 8);
  const data = png.subarray(pos + 8, pos + 8 + len);
  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
  }
  if (type === 'IDAT') chunks.push(data);
  pos += 12 + len;
}
if (colorType !== 0) throw new Error(`unexpected colorType ${colorType}`);
const raw = inflateSync(Buffer.concat(chunks));
const bytesPerRow = Math.ceil((width * bitDepth) / 8);
const bpp = Math.max(1, bitDepth / 8);

// 还原 PNG 行滤波
const out = Buffer.alloc(height * bytesPerRow);
for (let y = 0; y < height; y++) {
  const filter = raw[y * (bytesPerRow + 1)];
  const row = raw.subarray(y * (bytesPerRow + 1) + 1, (y + 1) * (bytesPerRow + 1));
  const prev = y > 0 ? out.subarray((y - 1) * bytesPerRow, y * bytesPerRow) : Buffer.alloc(bytesPerRow);
  const cur = out.subarray(y * bytesPerRow, (y + 1) * bytesPerRow);
  for (let x = 0; x < bytesPerRow; x++) {
    const a = x >= bpp ? cur[x - bpp] : 0;
    const b = prev[x];
    const c = x >= bpp ? prev[x - bpp] : 0;
    let val = row[x];
    if (filter === 1) val = (val + a) & 0xff;
    else if (filter === 2) val = (val + b) & 0xff;
    else if (filter === 3) val = (val + ((a + b) >> 1)) & 0xff;
    else if (filter === 4) {
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      val = (val + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
    }
    cur[x] = val;
  }
}

const pixel = (x, y) => {
  if (x < 0 || x >= width || y < 0 || y >= height) return 0;
  if (bitDepth === 1) return (out[y * bytesPerRow + (x >> 3)] >> (7 - (x & 7))) & 1;
  return out[y * bytesPerRow + x] > 127 ? 1 : 0;
};

// 掩码极性：陆地约占地表 29%，取占比小的一侧为陆地
let on = 0;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) on += pixel(x, y);
const ratio = on / (width * height);
const landVal = ratio < 0.5 ? 1 : 0;
const isLand = (x, y) => pixel(x, y) === landVal;

// —— 网格采样：150×72，纬度裁到 72°N–58°S（构图不含极区），行程编码 ——
const COLS = 150;
const ROWS = 72;
const LAT_TOP = 72;
const LAT_BOTTOM = -58;
const runs = [];
for (let r = 0; r < ROWS; r++) {
  const lat = LAT_TOP + (r / (ROWS - 1)) * (LAT_BOTTOM - LAT_TOP);
  const py = Math.round(((90 - lat) / 180) * (height - 1));
  let start = -1;
  for (let c = 0; c <= COLS; c++) {
    let land = false;
    if (c < COLS) {
      const lng = -180 + (c / (COLS - 1)) * 360;
      const px = Math.round(((lng + 180) / 360) * (width - 1));
      const votes = isLand(px, py) + isLand(px + 1, py) + isLand(px, py + 1) + isLand(px + 1, py + 1);
      land = votes >= 2;
    }
    if (land && start < 0) start = c;
    if (!land && start >= 0) {
      runs.push([r, start, c - start]);
      start = -1;
    }
  }
}

const total = runs.reduce((sum, [, , len]) => sum + len, 0);
const body = `// 自动生成 — node scripts/gen-map-dots.mjs（源：cobe 内嵌陆地掩码）；手改无效
// 平面点阵世界地图：${COLS}×${ROWS} 网格（纬度 ${LAT_TOP}°N–${Math.abs(LAT_BOTTOM)}°S），行程编码 [row, startCol, len]
export const MAP_GRID = {
  cols: ${COLS},
  rows: ${ROWS},
  latTop: ${LAT_TOP},
  latBottom: ${LAT_BOTTOM},
  runs: ${JSON.stringify(runs)},
} as const;
`;
writeFileSync('src/data/world-dots.ts', body);
console.log(`ratio=${ratio.toFixed(3)} landVal=${landVal} runs=${runs.length} dots=${total}`);
