export interface Brand {
  id: string;
  name: string;
  provinceCode: string;
  provinceName: string;
  alcoholContent: number;
  category: '白酒' | '啤酒' | '葡萄酒' | '黄酒' | '其他';
  foundedYear: number;
  description: string;
}

export interface QualityIssueType {
  code: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export const BRANDS: Brand[] = [
  {
    id: 'brand-001',
    name: '茅台',
    provinceCode: '520000',
    provinceName: '贵州省',
    alcoholContent: 53,
    category: '白酒',
    foundedYear: 1951,
    description: '酱香型白酒代表，国家地理标志产品',
  },
  {
    id: 'brand-002',
    name: '五粮液',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 1909,
    description: '浓香型白酒代表，中国名酒',
  },
  {
    id: 'brand-003',
    name: '泸州老窖',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 1573,
    description: '浓香型白酒鼻祖，国家级非物质文化遗产',
  },
  {
    id: 'brand-004',
    name: '汾酒',
    provinceCode: '140000',
    provinceName: '山西省',
    alcoholContent: 53,
    category: '白酒',
    foundedYear: 1949,
    description: '清香型白酒代表，中国四大名酒之一',
  },
  {
    id: 'brand-005',
    name: '剑南春',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 1951,
    description: '浓香型白酒，中国名酒',
  },
  {
    id: 'brand-006',
    name: '洋河',
    provinceCode: '320000',
    provinceName: '江苏省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 1949,
    description: '浓香型白酒，绵柔型白酒开创者',
  },
  {
    id: 'brand-007',
    name: '郎酒',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 53,
    category: '白酒',
    foundedYear: 1903,
    description: '酱香型白酒，中国百年老字号',
  },
  {
    id: 'brand-008',
    name: '古井贡酒',
    provinceCode: '340000',
    provinceName: '安徽省',
    alcoholContent: 50,
    category: '白酒',
    foundedYear: 1959,
    description: '浓香型白酒，中国老八大名酒',
  },
  {
    id: 'brand-009',
    name: '西凤酒',
    provinceCode: '610000',
    provinceName: '陕西省',
    alcoholContent: 55,
    category: '白酒',
    foundedYear: 1956,
    description: '凤香型白酒代表，中国四大名酒之一',
  },
  {
    id: 'brand-010',
    name: '董酒',
    provinceCode: '520000',
    provinceName: '贵州省',
    alcoholContent: 54,
    category: '白酒',
    foundedYear: 1957,
    description: '董香型白酒，国家级非物质文化遗产',
  },
  {
    id: 'brand-011',
    name: '青岛啤酒',
    provinceCode: '370000',
    provinceName: '山东省',
    alcoholContent: 4.3,
    category: '啤酒',
    foundedYear: 1903,
    description: '中国啤酒领军品牌，世界知名啤酒品牌',
  },
  {
    id: 'brand-012',
    name: '雪花啤酒',
    provinceCode: '110000',
    provinceName: '北京市',
    alcoholContent: 4.0,
    category: '啤酒',
    foundedYear: 1993,
    description: '中国销量领先的啤酒品牌',
  },
  {
    id: 'brand-013',
    name: '张裕葡萄酒',
    provinceCode: '370000',
    provinceName: '山东省',
    alcoholContent: 12,
    category: '葡萄酒',
    foundedYear: 1892,
    description: '中国葡萄酒行业的百年老字号',
  },
  {
    id: 'brand-014',
    name: '长城葡萄酒',
    provinceCode: '130000',
    provinceName: '河北省',
    alcoholContent: 12.5,
    category: '葡萄酒',
    foundedYear: 1983,
    description: '中国知名葡萄酒品牌，国家免检产品',
  },
  {
    id: 'brand-015',
    name: '绍兴黄酒',
    provinceCode: '330000',
    provinceName: '浙江省',
    alcoholContent: 15,
    category: '黄酒',
    foundedYear: 1743,
    description: '绍兴黄酒代表，世界三大古酒之一',
  },
  {
    id: 'brand-016',
    name: '女儿红',
    provinceCode: '330000',
    provinceName: '浙江省',
    alcoholContent: 14,
    category: '黄酒',
    foundedYear: 1919,
    description: '知名黄酒品牌，具有深厚文化底蕴',
  },
  {
    id: 'brand-017',
    name: '习酒',
    provinceCode: '520000',
    provinceName: '贵州省',
    alcoholContent: 53,
    category: '白酒',
    foundedYear: 1952,
    description: '酱香型白酒，贵州知名白酒品牌',
  },
  {
    id: 'brand-018',
    name: '牛栏山二锅头',
    provinceCode: '110000',
    provinceName: '北京市',
    alcoholContent: 46,
    category: '白酒',
    foundedYear: 1952,
    description: '清香型二锅头，北京老字号',
  },
  {
    id: 'brand-019',
    name: '水井坊',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 2000,
    description: '浓香型高端白酒，中国白酒第一坊',
  },
  {
    id: 'brand-020',
    name: '舍得酒',
    provinceCode: '510000',
    provinceName: '四川省',
    alcoholContent: 52,
    category: '白酒',
    foundedYear: 1940,
    description: '浓香型白酒，中国名酒沱牌曲酒的高端系列',
  },
];

export const QUALITY_ISSUE_TYPES: QualityIssueType[] = [
  {
    code: 'QI-001',
    name: '酒精度不达标',
    severity: 'high',
    description: '实际酒精度与标识值偏差超过国家标准允许范围',
  },
  {
    code: 'QI-002',
    name: '总酸含量异常',
    severity: 'medium',
    description: '总酸含量超出产品标准要求',
  },
  {
    code: 'QI-003',
    name: '总酯含量异常',
    severity: 'medium',
    description: '总酯含量不符合产品规格标准',
  },
  {
    code: 'QI-004',
    name: '固形物超标',
    severity: 'low',
    description: '固形物含量超过国家标准限值',
  },
  {
    code: 'QI-005',
    name: '甲醇超标',
    severity: 'critical',
    description: '甲醇含量超过食品安全国家标准，存在严重安全隐患',
  },
  {
    code: 'QI-006',
    name: '铅含量超标',
    severity: 'critical',
    description: '重金属铅含量超标，严重危害人体健康',
  },
  {
    code: 'QI-007',
    name: '微生物超标',
    severity: 'high',
    description: '菌落总数或致病菌检测超标',
  },
  {
    code: 'QI-008',
    name: '标签标识不规范',
    severity: 'low',
    description: '产品标签信息缺失、错误或不规范',
  },
  {
    code: 'QI-009',
    name: '包装破损',
    severity: 'low',
    description: '产品包装存在破损、渗漏等问题',
  },
  {
    code: 'QI-010',
    name: '感官指标异常',
    severity: 'medium',
    description: '色泽、香气、口味、风格等感官指标不符合标准',
  },
  {
    code: 'QI-011',
    name: '氰化物超标',
    severity: 'critical',
    description: '氰化物含量超过安全标准，剧毒物质',
  },
  {
    code: 'QI-012',
    name: '食品添加剂违规',
    severity: 'high',
    description: '违规使用食品添加剂或超量使用',
  },
];

export const BRAND_OPTIONS = BRANDS.map((b) => ({
  label: b.name,
  value: b.id,
}));

export const getBrandById = (id: string): Brand | undefined => {
  return BRANDS.find((b) => b.id === id);
};

export const getBrandsByProvince = (provinceCode: string): Brand[] => {
  return BRANDS.filter((b) => b.provinceCode === provinceCode);
};
