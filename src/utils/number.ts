export const formatThousand = (
  value: number | string | null | undefined,
  decimals: number = 0
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (
  value: number | string | null | undefined,
  decimals: number = 2,
  multiply: boolean = true
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  const result = multiply ? num * 100 : num;
  return `${result.toFixed(decimals)}%`;
};

export const formatWan = (
  value: number | string | null | undefined,
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return `${(num / 10000).toFixed(decimals)}万`;
};

export const formatWanQianSheng = (
  value: number | string | null | undefined,
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return `${(num / 10000).toFixed(decimals)}万千升`;
};

export const formatYi = (
  value: number | string | null | undefined,
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return `${(num / 100000000).toFixed(decimals)}亿`;
};

export const formatCurrency = (
  value: number | string | null | undefined,
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return `¥${num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatUnit = (
  value: number | string | null | undefined,
  unit: string = '',
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  return `${num.toFixed(decimals)}${unit}`;
};

export const formatAuto = (
  value: number | string | null | undefined,
  decimals: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '-';
  const abs = Math.abs(num);
  if (abs >= 100000000) {
    return formatYi(num, decimals);
  } else if (abs >= 10000) {
    return formatWan(num, decimals);
  }
  return formatThousand(num, decimals);
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
};

export const randomPick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randomSample = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const roundTo = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const toFixedNumber = (value: number, decimals: number = 2): number => {
  return Number(value.toFixed(decimals));
};

export const calculateRate = (
  numerator: number,
  denominator: number,
  decimals: number = 2
): number => {
  if (denominator === 0) return 0;
  return roundTo((numerator / denominator) * 100, decimals);
};

export const calculateGrowth = (
  current: number,
  previous: number,
  decimals: number = 2
): number => {
  if (previous === 0) return 0;
  return roundTo(((current - previous) / previous) * 100, decimals);
};
