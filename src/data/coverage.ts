// ⚠️ 占位覆盖数据 — 结构即最终结构，数值为占位
// 真实覆盖城市清单到位后仅替换本文件（docs/TODO 等待输入项）
// docs/10 骨架第 5 条：上线前必须换真数据并核对口径（AS OF 日期、Total/Unique 区分）

export interface City {
  name: string;
  code: string;
  lat: number;
  lng: number;
  country: string;
}

export interface DeliveryEvent {
  from: string; // City.code
  to: string;
  km: number;
  utc: string;
}

export const cities: City[] = [
  { name: 'Jakarta', code: 'JKT', lat: -6.2088, lng: 106.8456, country: 'ID' },
  { name: 'Singapore', code: 'SIN', lat: 1.3521, lng: 103.8198, country: 'SG' },
  { name: 'Bangkok', code: 'BKK', lat: 13.7563, lng: 100.5018, country: 'TH' },
  { name: 'Ho Chi Minh City', code: 'SGN', lat: 10.8231, lng: 106.6297, country: 'VN' },
  { name: 'Manila', code: 'MNL', lat: 14.5995, lng: 120.9842, country: 'PH' },
  { name: 'Kuala Lumpur', code: 'KUL', lat: 3.139, lng: 101.6869, country: 'MY' },
  { name: 'Dubai', code: 'DXB', lat: 25.2048, lng: 55.2708, country: 'AE' },
  { name: 'Riyadh', code: 'RUH', lat: 24.7136, lng: 46.6753, country: 'SA' },
  { name: 'Nairobi', code: 'NBO', lat: -1.2921, lng: 36.8219, country: 'KE' },
  { name: 'Lagos', code: 'LOS', lat: 6.5244, lng: 3.3792, country: 'NG' },
  { name: 'São Paulo', code: 'SAO', lat: -23.5505, lng: -46.6333, country: 'BR' },
  { name: 'Mexico City', code: 'MEX', lat: 19.4326, lng: -99.1332, country: 'MX' },
];

export const events: DeliveryEvent[] = [
  { from: 'JKT', to: 'SIN', km: 880, utc: '2026-07-14T09:32Z' },
  { from: 'NBO', to: 'DXB', km: 3520, utc: '2026-07-15T14:07Z' },
  { from: 'SGN', to: 'SIN', km: 1090, utc: '2026-07-16T03:41Z' },
  { from: 'LOS', to: 'NBO', km: 3807, utc: '2026-07-17T11:19Z' },
  { from: 'MNL', to: 'SIN', km: 2390, utc: '2026-07-18T08:53Z' },
  { from: 'BKK', to: 'KUL', km: 1180, utc: '2026-07-19T16:26Z' },
  { from: 'SAO', to: 'MEX', km: 7430, utc: '2026-07-20T21:04Z' },
  { from: 'DXB', to: 'RUH', km: 870, utc: '2026-07-21T06:38Z' },
  { from: 'KUL', to: 'JKT', km: 1180, utc: '2026-07-22T12:15Z' },
  { from: 'MEX', to: 'SAO', km: 7430, utc: '2026-07-23T18:47Z' },
  { from: 'SIN', to: 'BKK', km: 1420, utc: '2026-07-24T05:09Z' },
  { from: 'RUH', to: 'NBO', km: 2960, utc: '2026-07-25T10:31Z' },
];

export const metrics = {
  citiesCovered: cities.length,
  countries: 10,
  tasksCompleted: 1804,
  asOf: '2026-08-01',
} as const;

export const cityByCode: Record<string, City> = Object.fromEntries(cities.map((c) => [c.code, c]));
