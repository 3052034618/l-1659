interface Feature {
  type: 'Feature';
  properties: { name: string; adcode?: string };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: 'FeatureCollection';
  features: Feature[];
}

const provinces = [
  { name: '北京', code: '110000', cp: [116.405, 39.905] },
  { name: '天津', code: '120000', cp: [117.2, 39.13] },
  { name: '河北', code: '130000', cp: [114.51, 38.04] },
  { name: '山西', code: '140000', cp: [112.53, 37.87] },
  { name: '内蒙古', code: '150000', cp: [111.65, 40.82] },
  { name: '辽宁', code: '210000', cp: [123.43, 41.8] },
  { name: '吉林', code: '220000', cp: [125.32, 43.88] },
  { name: '黑龙江', code: '230000', cp: [126.63, 45.75] },
  { name: '上海', code: '310000', cp: [121.47, 31.23] },
  { name: '江苏', code: '320000', cp: [118.78, 32.04] },
  { name: '浙江', code: '330000', cp: [120.15, 30.28] },
  { name: '安徽', code: '340000', cp: [117.28, 31.86] },
  { name: '福建', code: '350000', cp: [119.3, 26.08] },
  { name: '江西', code: '360000', cp: [115.89, 28.68] },
  { name: '山东', code: '370000', cp: [117.0, 36.65] },
  { name: '河南', code: '410000', cp: [113.65, 34.76] },
  { name: '湖北', code: '420000', cp: [114.31, 30.52] },
  { name: '湖南', code: '430000', cp: [112.98, 28.19] },
  { name: '广东', code: '440000', cp: [113.23, 23.16] },
  { name: '广西', code: '450000', cp: [108.33, 22.84] },
  { name: '海南', code: '460000', cp: [110.35, 20.02] },
  { name: '重庆', code: '500000', cp: [106.54, 29.59] },
  { name: '四川', code: '510000', cp: [104.06, 30.67] },
  { name: '贵州', code: '520000', cp: [106.71, 26.57] },
  { name: '云南', code: '530000', cp: [102.73, 25.04] },
  { name: '西藏', code: '540000', cp: [91.11, 29.97] },
  { name: '陕西', code: '610000', cp: [108.95, 34.27] },
  { name: '甘肃', code: '620000', cp: [103.82, 36.06] },
  { name: '青海', code: '630000', cp: [101.78, 36.62] },
  { name: '宁夏', code: '640000', cp: [106.27, 38.47] },
  { name: '新疆', code: '650000', cp: [87.62, 43.82] },
  { name: '台湾', code: '710000', cp: [121.5, 25.05] },
  { name: '香港', code: '810000', cp: [114.17, 22.28] },
  { name: '澳门', code: '820000', cp: [113.54, 22.19] },
];

const size = 3.5;
const makeRect = (lng: number, lat: number, w = size, h = size) => {
  const halfW = w / 2;
  const halfH = h / 2;
  return [
    [lng - halfW, lat - halfH],
    [lng + halfW, lat - halfH],
    [lng + halfW, lat + halfH],
    [lng - halfW, lat + halfH],
    [lng - halfW, lat - halfH],
  ];
};

const features: Feature[] = provinces.map((p) => ({
  type: 'Feature',
  properties: { name: p.name, adcode: p.code },
  geometry: {
    type: 'Polygon',
    coordinates: [makeRect(p.cp[0], p.cp[1])],
  },
}));

const chinaGeo: GeoJSON = {
  type: 'FeatureCollection',
  features,
};

export default chinaGeo;
export { provinces };
