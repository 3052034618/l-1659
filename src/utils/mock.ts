import { PROVINCES, getProvinceByCode, getCitiesByProvinceCode } from '../constants/regions';
import { BRANDS, QUALITY_ISSUE_TYPES, getBrandById } from '../constants/brands';
import type { RoleType } from '../constants/config';
import { getRoleName } from '../constants/config';
import { randomInt, randomFloat, randomPick, randomSample, roundTo } from './number';
import {
  date,
  getLastNDays,
  getLastNMonths,
  formatDateTime,
  formatDate,
  randomDate,
  randomDateTime,
  now,
} from './date';
import type {
  User,
  KPIData,
  ProvinceData,
  CityData,
  BrandBrief,
  QualityIssue,
  Alert,
  AlertType,
  AlertLevel,
  AlertStatus,
  ApprovalStep,
  ActionPlan,
  AlertLog,
  MetricPoint,
  ProductionPlan,
  MonthlyTarget,
  PredictionResult,
  ForecastDay,
  InventoryStrategy,
  WeeklyReport,
  ReportMetrics,
  QualityAnalysis,
  BrandSatisfaction,
  Enterprise,
  DataStreamRecord,
  DataStreamType,
  YoYMoM,
} from '../types';

let idCounter = 1;
const genId = (prefix: string = 'id'): string => `${prefix}-${String(idCounter++).padStart(4, '0')}`;

const createYoYMoM = (base: number, variance: number = 15): YoYMoM => ({
  value: base,
  yoy: roundTo(randomFloat(-variance, variance + 10)),
  mom: roundTo(randomFloat(-variance * 0.6, variance * 0.6)),
});

export const generateUsers = (count: number = 15): User[] => {
  const roles: RoleType[] = [
    'super_admin',
    'national_manager',
    'province_manager',
    'city_manager',
    'quality_inspector',
    'auditor',
    'viewer',
  ];
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡'];
  const givenNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛'];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const role = randomPick(roles);
    const province = randomPick(PROVINCES);
    const cities = getCitiesByProvinceCode(province.code);
    const city = cities.length > 0 ? randomPick(cities) : undefined;
    const name = randomPick(surnames) + randomPick(givenNames);
    users.push({
      id: genId('user'),
      username: `user${i + 1}`,
      name,
      role,
      email: `user${i + 1}@example.com`,
      phone: `138${String(randomInt(10000000, 99999999))}`,
      provinceCode: province.code,
      cityCode: city?.code,
      permissions: [],
      createdAt: formatDateTime(randomDateTime(date().subtract(365, 'day'), date().subtract(30, 'day'))),
      lastLoginAt: formatDateTime(randomDateTime(date().subtract(30, 'day'), date())),
      isActive: true,
    });
  }

  if (!users.some((u) => u.role === 'super_admin')) {
    users[0].role = 'super_admin';
    users[0].name = '超级管理员';
    users[0].username = 'admin';
  }

  return users;
};

export const generateKPIData = (): KPIData => ({
  totalProduction: createYoYMoM(randomInt(380000, 520000)),
  totalSales: createYoYMoM(randomInt(360000, 500000)),
  totalRevenue: createYoYMoM(randomInt(2800000, 4200000)),
  qualityPassRate: createYoYMoM(randomFloat(96.5, 99.5, 2), 3),
  averageSatisfaction: createYoYMoM(randomFloat(88, 96, 2), 5),
  inventoryDays: createYoYMoM(randomInt(35, 68), 10),
  activeEnterprises: createYoYMoM(randomInt(16800, 22000), 8),
  alertCount: createYoYMoM(randomInt(120, 380), 20),
});

export const generateMetricPoints = (
  days: number,
  min: number,
  max: number
): MetricPoint[] => {
  const dates = getLastNDays(days);
  return dates.map((d) => ({
    date: d,
    value: roundTo(randomFloat(min, max)),
    yoy: roundTo(randomFloat(-10, 15)),
    mom: roundTo(randomFloat(-8, 10)),
  }));
};

export const generateCityData = (provinceCode: string): CityData[] => {
  const province = getProvinceByCode(provinceCode);
  if (!province) return [];
  return province.cities.map((city) => ({
    code: city.code,
    name: city.name,
    production: randomInt(800, 15000),
    sales: randomInt(700, 14500),
    revenue: randomInt(5000, 120000),
    qualityPassRate: roundTo(randomFloat(94, 99.8, 2)),
    enterprises: randomInt(20, 280),
    brands: randomInt(2, 15),
  }));
};

export const generateProvinceData = (): ProvinceData[] => {
  const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
  return PROVINCES.map((province) => {
    const provinceBrands = BRANDS.filter((b) => b.provinceCode === province.code);
    const topBrands: BrandBrief[] = (provinceBrands.length > 0
      ? provinceBrands
      : randomSample(BRANDS, 3)
    ).map((b, idx) => ({
      id: b.id,
      name: b.name,
      provinceName: b.provinceName,
      category: b.category,
      alcoholContent: b.alcoholContent,
      rank: idx + 1,
      score: roundTo(randomFloat(75, 98)),
      marketShare: roundTo(randomFloat(0.5, 12, 2)),
      sales: randomInt(5000, 80000),
      satisfaction: roundTo(randomFloat(85, 97, 2)),
      production: randomInt(2000, 60000),
      trend: randomPick(trends),
    }));

    return {
      code: province.code,
      name: province.name,
      shortName: province.shortName,
      production: createYoYMoM(randomInt(5000, 80000)),
      sales: createYoYMoM(randomInt(4500, 78000)),
      revenue: createYoYMoM(randomInt(30000, 650000)),
      qualityPassRate: createYoYMoM(randomFloat(95, 99.5, 2), 3),
      satisfaction: createYoYMoM(randomFloat(86, 96, 2), 4),
      inventoryDays: createYoYMoM(randomInt(30, 80), 12),
      cities: generateCityData(province.code),
      productionTrend: generateMetricPoints(30, 100, 2000),
      salesTrend: generateMetricPoints(30, 100, 1800),
      topBrands,
      enterpriseCount: randomInt(50, 1200),
      brandCount: randomInt(3, 25),
    };
  });
};

export const generateBrandRankings = (): BrandBrief[] => {
  const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
  return BRANDS.map((b, idx) => ({
    id: b.id,
    name: b.name,
    provinceName: b.provinceName,
    category: b.category,
    alcoholContent: b.alcoholContent,
    rank: idx + 1,
    score: roundTo(randomFloat(78, 99, 2)),
    marketShare: roundTo(randomFloat(0.3, 18, 2)),
    sales: randomInt(8000, 120000),
    satisfaction: roundTo(randomFloat(84, 98, 2)),
    production: randomInt(3000, 95000),
    trend: randomPick(trends),
  })).sort((a, b) => b.score - a.score)
    .map((b, i) => ({ ...b, rank: i + 1 }));
};

const getAlertTypeName = (type: AlertType): string => {
  const map: Record<AlertType, string> = {
    quality: '质量预警',
    production: '生产预警',
    inventory: '库存预警',
    sales: '销售预警',
    satisfaction: '满意度预警',
    compliance: '合规预警',
  };
  return map[type];
};

export const generateQualityIssues = (count: number = 5): QualityIssue[] => {
  const issues: QualityIssue[] = [];
  for (let i = 0; i < count; i++) {
    const province = randomPick(PROVINCES);
    const cities = getCitiesByProvinceCode(province.code);
    const city = cities.length > 0 ? randomPick(cities) : undefined;
    const brand = randomPick(BRANDS);
    const issueType = randomPick(QUALITY_ISSUE_TYPES);
    issues.push({
      id: genId('qi'),
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['金辉', '恒泰', '昌盛', '顺达', '兴隆'])}酒业有限公司`,
      brandId: brand.id,
      brandName: brand.name,
      provinceCode: province.code,
      provinceName: province.name,
      cityCode: city?.code || province.code,
      cityName: city?.name || province.name,
      issueType: issueType.code,
      issueTypeName: issueType.name,
      severity: issueType.severity,
      batchNo: `B${String(randomInt(20240000, 20269999))}`,
      productDate: formatDate(randomDate(date().subtract(180, 'day'), date().subtract(7, 'day'))),
      detectedValue: roundTo(randomFloat(0.1, 15, 3)),
      standardValue: `≤${randomFloat(0.01, 5, 3)}`,
      description: `${issueType.name}，检测值超出标准范围，需立即整改。`,
      detectedAt: formatDateTime(randomDateTime(date().subtract(60, 'day'), date())),
      inspector: randomPick(['质检部-王芳', '质检部-李强', '质检部-陈静', '质检部-刘伟']),
      status: randomPick(['pending', 'processing', 'resolved', 'closed']),
    });
  }
  return issues;
};

export const generateApprovalSteps = (alertId: string, currentLevel: number): ApprovalStep[] => {
  const steps: ApprovalStep[] = [];
  const levels = 2;
  for (let i = 1; i <= levels; i++) {
    const isDone = i < currentLevel;
    const isCurrent = i === currentLevel;
    steps.push({
      id: genId('step'),
      alertId,
      level: i,
      approverId: genId('user'),
      approverName: isDone || isCurrent
        ? randomPick(['张总监', '李经理', '王主任', '赵总'])
        : '待审批',
      approverRole: isDone || isCurrent
        ? getRoleName(i === 1 ? 'province_manager' : 'national_manager')
        : '',
      status: isDone ? 'approved' : isCurrent ? 'pending' : 'pending',
      comment: isDone ? randomPick(['同意', '情况属实，同意处理方案', '审批通过', '按方案执行']) : undefined,
      createdAt: formatDateTime(randomDateTime(date().subtract(30, 'day'), date())),
      approvedAt: isDone ? formatDateTime(randomDateTime(date().subtract(15, 'day'), date())) : undefined,
    });
  }
  return steps;
};

export const generateActionPlans = (alertId: string, count: number = 1): ActionPlan[] => {
  const plans: ActionPlan[] = [];
  for (let i = 0; i < count; i++) {
    const status: ActionPlan['status'] = randomPick([
      'draft',
      'pending',
      'in_progress',
      'completed',
      'cancelled',
    ]);
    const startDate = date().subtract(randomInt(1, 45), 'day');
    const endDate = startDate.add(randomInt(15, 60), 'day');
    const isCompleted = status === 'completed';
    plans.push({
      id: genId('plan'),
      alertId,
      title: randomPick([
        '质量问题整改方案',
        '生产工艺优化计划',
        '库存管理调整方案',
        '客户满意度提升计划',
      ]),
      description: '针对预警问题制定详细的整改措施和执行计划，确保问题得到有效解决。',
      responsibleId: genId('user'),
      responsibleName: randomPick(['张工', '李主任', '王经理', '陈主管']),
      startDate: formatDate(startDate),
      deadline: formatDate(endDate),
      endDate: isCompleted ? formatDate(endDate.subtract(randomInt(0, 10), 'day')) : undefined,
      progress: status === 'completed' ? 100 : status === 'cancelled' ? randomInt(10, 60) : randomInt(10, 90),
      status,
      priority: randomPick(['low', 'medium', 'high', 'urgent']),
      budget: randomInt(5000, 500000),
      createdAt: formatDateTime(startDate),
      updatedAt: formatDateTime(now()),
    });
  }
  return plans;
};

export const generateAlerts = (count: number = 18): Alert[] => {
  const types: AlertType[] = ['quality', 'production', 'inventory', 'sales', 'satisfaction', 'compliance'];
  const levels: AlertLevel[] = ['info', 'warning', 'danger', 'critical'];
  const statuses: AlertStatus[] = ['pending', 'approved', 'processing', 'resolved', 'rejected', 'closed'];
  const alerts: Alert[] = [];

  for (let i = 0; i < count; i++) {
    const type = randomPick(types);
    const level = type === 'quality' || type === 'compliance'
      ? randomPick(['warning', 'danger', 'critical'] as AlertLevel[])
      : randomPick(levels);
    const status = randomPick(statuses);
    const province = randomPick(PROVINCES);
    const cities = getCitiesByProvinceCode(province.code);
    const city = cities.length > 0 ? randomPick(cities) : undefined;
    const brand = randomPick(BRANDS);
    const threshold = randomInt(50, 200);
    const indicator = roundTo(threshold * randomFloat(1.05, 2.5));
    const currentLevel = status === 'pending' ? 1 : status === 'approved' || status === 'processing' ? 2 : 3;

    alerts.push({
      id: genId('alert'),
      alertNo: `ALT${date().format('YYYYMM')}${String(i + 1).padStart(4, '0')}`,
      type,
      typeName: getAlertTypeName(type),
      level,
      status,
      title: `${level === 'critical' ? '【紧急】' : level === 'danger' ? '【重要】' : ''}${province.shortName}${getAlertTypeName(type)}`,
      description: `${province.name}${city?.name || ''}区域${getAlertTypeName(type)}，指标${indicator}超出阈值${threshold}，偏差${roundTo(((indicator - threshold) / threshold) * 100)}%。请相关人员及时处理。`,
      provinceCode: province.code,
      provinceName: province.name,
      cityCode: city?.code,
      cityName: city?.name,
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['华樽', '盛世', '佳酿', '醇香', '御品'])}酒业集团`,
      brandId: brand.id,
      brandName: brand.name,
      indicatorValue: indicator,
      thresholdValue: threshold,
      deviation: roundTo(((indicator - threshold) / threshold) * 100),
      riskScore: roundTo(level === 'critical' ? randomFloat(85, 100)
        : level === 'danger' ? randomFloat(65, 85)
        : level === 'warning' ? randomFloat(40, 65)
        : randomFloat(15, 40), 1),
      createdAt: formatDateTime(randomDateTime(date().subtract(60, 'day'), date())),
      createdBy: randomPick(['系统自动检测', '张经理', '李主任', '王主管']),
      approvedAt: status !== 'pending' ? formatDateTime(randomDateTime(date().subtract(30, 'day'), date())) : undefined,
      resolvedAt: status === 'resolved' || status === 'closed'
        ? formatDateTime(randomDateTime(date().subtract(15, 'day'), date())) : undefined,
      closedAt: status === 'closed' ? formatDateTime(randomDateTime(date().subtract(7, 'day'), date())) : undefined,
      qualityIssues: type === 'quality' ? generateQualityIssues(randomInt(1, 3)) : undefined,
      approvalSteps: generateApprovalSteps(genId('alert'), currentLevel),
      currentApprovalLevel: currentLevel,
      actionPlans: status !== 'pending' && status !== 'rejected' ? generateActionPlans(genId('alert'), randomInt(1, 2)) : undefined,
      relatedAlerts: [],
    });
  }
  return alerts.sort((a, b) => date(b.createdAt).valueOf() - date(a.createdAt).valueOf());
};

export const generateAlertLogs = (alertId: string, count: number = 5): AlertLog[] => {
  const actions = [
    { key: 'create', name: '创建预警' },
    { key: 'submit', name: '提交审批' },
    { key: 'approve', name: '审批通过' },
    { key: 'reject', name: '审批驳回' },
    { key: 'assign', name: '分配处理人' },
    { key: 'update', name: '更新进度' },
    { key: 'resolve', name: '标记解决' },
    { key: 'close', name: '关闭预警' },
  ];
  const sampled = randomSample(actions, count);
  return sampled.map((a, idx) => ({
    id: genId('log'),
    alertId,
    action: a.key,
    actionName: a.name,
    operatorId: genId('user'),
    operatorName: randomPick(['系统', '张总监', '李经理', '王主任', '赵主管']),
    comment: idx === 0 ? '创建预警记录' : randomPick([
      '情况属实，同意处理',
      '已指派相关负责人跟进',
      '处理方案合理，同意执行',
      '进度符合预期',
      '问题已解决，验证通过',
    ]),
    createdAt: formatDateTime(date().subtract(idx * randomInt(1, 5), 'day')),
  }));
};

export const generateProductionPlans = (count: number = 20): ProductionPlan[] => {
  const plans: ProductionPlan[] = [];
  const currentYear = date().year();
  const currentMonth = date().month() + 1;
  for (let i = 0; i < count; i++) {
    const province = randomPick(PROVINCES);
    const brand = randomPick(BRANDS);
    const year = currentYear;
    const month = ((currentMonth - 1 - i + 12) % 12) + 1;
    const planned = randomInt(1000, 50000);
    const actual = roundTo(planned * randomFloat(0.7, 1.2));
    plans.push({
      id: genId('pp'),
      planNo: `PP${year}${String(month).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['盛世', '佳酿', '醇香', '御品', '金樽'])}酒业有限公司`,
      brandId: brand.id,
      brandName: brand.name,
      provinceCode: province.code,
      provinceName: province.name,
      year,
      month,
      plannedVolume: planned,
      actualVolume: actual,
      completionRate: roundTo((actual / planned) * 100),
      status: randomPick(['draft', 'approved', 'executing', 'completed', 'adjusted']),
      startDate: formatDate(date(`${year}-${String(month).padStart(2, '0')}-01`)),
      endDate: formatDate(date(`${year}-${String(month).padStart(2, '0')}-01`).endOf('month')),
      createdAt: formatDateTime(randomDateTime(date().subtract(365, 'day'), date())),
      updatedAt: formatDateTime(now()),
    });
  }
  return plans;
};

export const generateMonthlyTargets = (months: number = 12): MonthlyTarget[] => {
  const targets: MonthlyTarget[] = [];
  const lastMonths = getLastNMonths(months);
  lastMonths.forEach((m, idx) => {
    const [year, month] = m.split('-').map(Number);
    targets.push({
      id: genId('mt'),
      year,
      month,
      productionTarget: randomInt(35000, 55000),
      salesTarget: randomInt(32000, 52000),
      revenueTarget: randomInt(250000, 400000),
      qualityTarget: roundTo(randomFloat(97, 99.5, 2)),
      satisfactionTarget: roundTo(randomFloat(88, 95, 2)),
      productionActual: idx < months - 1 ? randomInt(30000, 58000) : undefined,
      salesActual: idx < months - 1 ? randomInt(28000, 55000) : undefined,
      revenueActual: idx < months - 1 ? randomInt(220000, 420000) : undefined,
      qualityActual: idx < months - 1 ? roundTo(randomFloat(95, 99.8, 2)) : undefined,
      satisfactionActual: idx < months - 1 ? roundTo(randomFloat(85, 97, 2)) : undefined,
    });
  });
  return targets;
};

export const generateForecastDays = (days: number = 90): ForecastDay[] => {
  const result: ForecastDay[] = [];
  const start = date().add(1, 'day');
  let base = randomInt(45000, 60000);
  for (let i = 0; i < days; i++) {
    base = roundTo(base * randomFloat(0.97, 1.03));
    const variance = base * randomFloat(0.08, 0.15);
    result.push({
      date: formatDate(start.add(i, 'day')),
      forecastProduction: base,
      forecastSales: roundTo(base * randomFloat(0.92, 1.02)),
      forecastRevenue: roundTo(base * randomFloat(6, 9)),
      lowerBound: roundTo(base - variance),
      upperBound: roundTo(base + variance),
      confidence: roundTo(randomFloat(82, 97, 1)),
    });
  }
  return result;
};

export const generatePrediction = (days: number = 90): PredictionResult => {
  return {
    id: genId('pred'),
    modelName: 'LSTM时间序列预测模型_v2.1',
    startDate: formatDate(date().add(1, 'day')),
    endDate: formatDate(date().add(days, 'day')),
    forecastDays: generateForecastDays(days),
    accuracy: roundTo(randomFloat(88, 96, 2)),
    rmse: roundTo(randomFloat(500, 2500, 2)),
    mae: roundTo(randomFloat(300, 1800, 2)),
    createdAt: formatDateTime(now()),
  };
};

export const generateInventoryStrategies = (count: number = 25): InventoryStrategy[] => {
  const strategies: InventoryStrategy[] = [];
  for (let i = 0; i < count; i++) {
    const brand = randomPick(BRANDS);
    const province = randomPick(PROVINCES);
    const safe = randomInt(1000, 8000);
    const current = roundTo(safe * randomFloat(0.4, 1.8));
    strategies.push({
      id: genId('inv'),
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['恒达', '瑞丰', '源泰', '鼎盛', '华康'])}酒业有限公司`,
      brandId: brand.id,
      brandName: brand.name,
      safeInventory: safe,
      maxInventory: roundTo(safe * 1.8),
      minInventory: roundTo(safe * 0.5),
      currentInventory: current,
      turnoverDays: roundTo(randomFloat(25, 75, 1)),
      suggestedAction: current > safe * 1.5 ? 'decrease' : current < safe * 0.7 ? 'increase' : 'maintain',
      lastUpdated: formatDateTime(randomDateTime(date().subtract(7, 'day'), date())),
    });
  }
  return strategies;
};

export const generateEnterprises = (count: number = 50): Enterprise[] => {
  const enterprises: Enterprise[] = [];
  const companySuffixes = [
    '酒业有限公司', '酒业集团有限公司', '酿酒股份有限公司',
    '酒类有限公司', '酿造有限公司',
  ];
  const prefixes = [
    '金辉', '恒泰', '昌盛', '顺达', '兴隆', '盛世', '佳酿', '醇香',
    '御品', '金樽', '瑞丰', '源泰', '鼎盛', '华康', '亿达', '宏源',
  ];
  for (let i = 0; i < count; i++) {
    const province = randomPick(PROVINCES);
    const cities = getCitiesByProvinceCode(province.code);
    const city = cities.length > 0 ? randomPick(cities) : undefined;
    enterprises.push({
      id: genId('ent'),
      name: `${province.shortName}${randomPick(prefixes)}${randomPick(companySuffixes)}`,
      shortName: `${randomPick(prefixes)}酒业`,
      legalPerson: randomPick(['张建国', '李明华', '王志强', '刘大龙', '陈建国']),
      unifiedCode: `91${province.code}${String(randomInt(10000000, 99999999))}`,
      licenseNo: `SC${String(randomInt(110000, 999999))}${String(randomInt(1000, 9999))}`,
      provinceCode: province.code,
      provinceName: province.name,
      cityCode: city?.code || province.code,
      cityName: city?.name || province.name,
      address: `${city?.name || province.name}${randomPick(['高新区', '经济开发区', '工业园', '产业园'])}${randomPick(['第1号', '88号', '268号', '108号'])}`,
      phone: `0${randomInt(10, 999)}-${String(randomInt(1000000, 9999999))}`,
      email: `contact${i + 1}@enterprise${i + 1}.com`,
      foundedAt: formatDate(randomDate(date().subtract(10950, 'day'), date().subtract(1095, 'day'))),
      registeredCapital: randomInt(100, 50000),
      employees: randomInt(30, 5000),
      level: randomPick(['national', 'provincial', 'municipal']),
      scale: randomPick(['small', 'medium', 'large']),
      status: randomPick(['active', 'active', 'active', 'suspended']),
      mainBrands: randomSample(BRANDS, randomInt(1, 4)).map((b) => b.id),
      mainCategories: randomSample(['白酒', '啤酒', '葡萄酒', '黄酒', '其他'], randomInt(1, 3)),
      annualProduction: randomInt(500, 80000),
      annualRevenue: randomInt(3000, 800000),
      qualityRating: randomPick(['A', 'A', 'A', 'B', 'B', 'C', 'D']),
      lastInspectionAt: formatDateTime(randomDateTime(date().subtract(180, 'day'), date())),
      createdAt: formatDateTime(randomDateTime(date().subtract(1825, 'day'), date().subtract(365, 'day'))),
      updatedAt: formatDateTime(now()),
    });
  }
  return enterprises;
};

export const generateWeeklyReports = (count: number = 8): WeeklyReport[] => {
  const reports: WeeklyReport[] = [];
  const start = date().startOf('week');
  for (let i = 0; i < count; i++) {
    const weekStart = start.subtract(i, 'week');
    const weekEnd = weekStart.endOf('week');
    const province = i % 3 === 0 ? undefined : randomPick(PROVINCES);
    reports.push({
      id: genId('wr'),
      reportNo: `WR${weekStart.format('YYYYWW')}${String(i + 1).padStart(2, '0')}`,
      title: `${province ? province.name : '全国'}酒类行业周报（第${weekStart.week()}周）`,
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      provinceCode: province?.code,
      provinceName: province?.name,
      metrics: {
        totalProduction: randomInt(35000, 65000),
        totalSales: randomInt(32000, 62000),
        totalRevenue: randomInt(250000, 450000),
        productionYoY: roundTo(randomFloat(-12, 18)),
        salesYoY: roundTo(randomFloat(-10, 20)),
        revenueYoY: roundTo(randomFloat(-8, 22)),
        productionMoM: roundTo(randomFloat(-6, 10)),
        salesMoM: roundTo(randomFloat(-7, 11)),
        revenueMoM: roundTo(randomFloat(-5, 13)),
        qualityPassRate: roundTo(randomFloat(95, 99.6, 2)),
        qualityPassRateYoY: roundTo(randomFloat(-2, 3, 2)),
        averageSatisfaction: roundTo(randomFloat(86, 96, 2)),
        satisfactionYoY: roundTo(randomFloat(-3, 4, 2)),
        alertCount: randomInt(15, 80),
        resolvedAlertCount: randomInt(10, 70),
        enterpriseCount: randomInt(15000, 22000),
        topProvince: randomPick(PROVINCES).name,
        topBrand: randomPick(BRANDS).name,
      },
      highlights: [
        `本周产量${i % 2 === 0 ? '稳中有升' : '小幅调整'}，优质名酒产区表现突出`,
        '品牌营销活动成效显著，市场关注度持续提升',
        '质量合格率保持高位运行，质量管控体系有效',
      ],
      problems: [
        '部分区域库存周转偏慢，需关注去库存进度',
        '高端市场竞争加剧，中小品牌压力增大',
      ],
      suggestions: [
        '建议加强渠道下沉，拓展三四线城市市场',
        '持续推进数字化转型，提升生产运营效率',
        '加大品牌投入，巩固核心竞争优势',
      ],
      authorId: genId('user'),
      authorName: randomPick(['市场分析部', '运营中心', '战略研究室', '数据科']),
      status: randomPick(['draft', 'submitted', 'approved', 'approved', 'approved']),
      createdAt: formatDateTime(weekEnd.add(1, 'day')),
      updatedAt: formatDateTime(weekEnd.add(1, 'day').add(randomInt(1, 24), 'hour')),
    });
  }
  return reports;
};

export const generateQualityAnalysis = (count: number = 10): QualityAnalysis[] => {
  const analyses: QualityAnalysis[] = [];
  for (let i = 0; i < count; i++) {
    const province = randomPick(PROVINCES);
    const total = randomInt(500, 5000);
    const qualified = roundTo(total * randomFloat(0.94, 0.998));
    analyses.push({
      id: genId('qa'),
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['恒泰', '昌盛', '顺达', '兴隆', '金辉'])}酒业有限公司`,
      provinceCode: province.code,
      provinceName: province.name,
      period: randomPick(['2026年1月', '2026年2月', '2026年Q1', '2026年上半年', '2025年全年']),
      totalSamples: total,
      qualifiedSamples: qualified,
      passRate: roundTo((qualified / total) * 100, 2),
      passRateYoY: roundTo(randomFloat(-3, 4, 2)),
      passRateMoM: roundTo(randomFloat(-1.5, 2, 2)),
      issuesByType: {
        'QI-001': randomInt(1, 30),
        'QI-002': randomInt(1, 25),
        'QI-003': randomInt(0, 20),
        'QI-004': randomInt(0, 15),
      },
      issuesBySeverity: {
        low: randomInt(2, 40),
        medium: randomInt(1, 25),
        high: randomInt(0, 10),
        critical: randomInt(0, 3),
      },
      topIssues: randomSample(QUALITY_ISSUE_TYPES, 3).map((t) => ({
        type: t.code,
        typeName: t.name,
        count: randomInt(3, 35),
        rate: roundTo(randomFloat(0.1, 2.5, 2)),
      })),
      generatedAt: formatDateTime(now()),
    });
  }
  return analyses;
};

export const generateBrandSatisfactions = (count: number = 20): BrandSatisfaction[] => {
  return BRANDS.slice(0, count).map((b) => ({
    id: genId('bs'),
    brandId: b.id,
    brandName: b.name,
    provinceCode: b.provinceCode,
    provinceName: b.provinceName,
    period: '2026年Q1',
    overallScore: roundTo(randomFloat(84, 97, 2)),
    tasteScore: roundTo(randomFloat(82, 98, 2)),
    packagingScore: roundTo(randomFloat(80, 96, 2)),
    valueScore: roundTo(randomFloat(83, 95, 2)),
    serviceScore: roundTo(randomFloat(81, 96, 2)),
    sampleSize: randomInt(500, 8000),
    scoreYoY: roundTo(randomFloat(-2, 5, 2)),
    scoreMoM: roundTo(randomFloat(-1, 3, 2)),
    complaints: randomInt(3, 120),
    praises: randomInt(80, 2000),
  }));
};

const getStreamTypeName = (t: DataStreamType): string => {
  const map: Record<DataStreamType, string> = {
    production: '生产数据',
    sales: '销售数据',
    inventory: '库存数据',
    quality: '质量数据',
    temperature: '温度数据',
    humidity: '湿度数据',
  };
  return map[t];
};

export const generateDataStreams = (count: number = 60): DataStreamRecord[] => {
  const types: DataStreamType[] = ['production', 'sales', 'inventory', 'quality', 'temperature', 'humidity'];
  const streams: DataStreamRecord[] = [];
  const baseTime = now();

  for (let i = 0; i < count; i++) {
    const type = randomPick(types);
    const province = randomPick(PROVINCES);
    const brand = randomPick(BRANDS);
    const timestamp = baseTime.subtract(i * randomInt(15, 180), 'second');
    let metricName = '';
    let metricValue = 0;
    let metricUnit = '';
    let minVal: number | undefined;
    let maxVal: number | undefined;
    let threshold: number | undefined;

    switch (type) {
      case 'production':
        metricName = randomPick(['实时产能', '生产线速度', '日产量']);
        metricValue = roundTo(randomFloat(20, 500));
        metricUnit = '千升/小时';
        threshold = 400;
        break;
      case 'sales':
        metricName = randomPick(['实时订单量', '销售额', '出库量']);
        metricValue = roundTo(randomFloat(100, 5000));
        metricUnit = '单/小时';
        threshold = 4500;
        break;
      case 'inventory':
        metricName = randomPick(['当前库存', '周转率', '安全库存']);
        metricValue = roundTo(randomFloat(500, 15000));
        metricUnit = '千升';
        minVal = 1000;
        maxVal = 12000;
        break;
      case 'quality':
        metricName = randomPick(['在线检测合格率', '杂质含量', '酒精度']);
        metricValue = type.includes('合格率') ? roundTo(randomFloat(92, 99.9, 2)) : roundTo(randomFloat(0.001, 0.5, 4));
        metricUnit = type.includes('合格率') ? '%' : 'g/L';
        threshold = type.includes('合格率') ? 95 : 0.4;
        break;
      case 'temperature':
        metricName = randomPick(['发酵温度', '储存温度', '车间温度']);
        metricValue = roundTo(randomFloat(15, 35, 1));
        metricUnit = '℃';
        minVal = 18;
        maxVal = 28;
        break;
      case 'humidity':
        metricName = randomPick(['环境湿度', '酒窖湿度', '仓库湿度']);
        metricValue = roundTo(randomFloat(40, 85, 1));
        metricUnit = '%RH';
        minVal = 50;
        maxVal = 75;
        break;
    }

    let status: DataStreamRecord['status'] = 'normal';
    if (threshold) {
      if (metricName.includes('合格率')) {
        if (metricValue < threshold) status = 'warning';
        if (metricValue < threshold - 2) status = 'alert';
      } else {
        if (metricValue > threshold) status = 'warning';
        if (metricValue > threshold * 1.1) status = 'alert';
      }
    }
    if (minVal && maxVal) {
      if (metricValue < minVal || metricValue > maxVal) status = 'warning';
      if (metricValue < minVal * 0.9 || metricValue > maxVal * 1.1) status = 'alert';
    }

    streams.push({
      id: genId('ds'),
      timestamp: formatDateTime(timestamp),
      enterpriseId: genId('ent'),
      enterpriseName: `${province.shortName}${randomPick(['恒泰', '昌盛', '顺达', '兴隆'])}酒业`,
      provinceCode: province.code,
      provinceName: province.name,
      streamType: type,
      streamTypeName: getStreamTypeName(type),
      metricName,
      metricValue,
      metricUnit,
      minValue: minVal,
      maxValue: maxVal,
      threshold,
      status,
      deviceId: `DEV-${String(randomInt(1000, 9999))}`,
      deviceName: randomPick(['智能传感器-01', '生产线监控-A', '仓库监测系统', '质量在线检测系统']),
    });
  }
  return streams.sort((a, b) => date(b.timestamp).valueOf() - date(a.timestamp).valueOf());
};

export const generateReportMetrics = (): ReportMetrics => ({
  totalProduction: randomInt(350000, 520000),
  totalSales: randomInt(330000, 500000),
  totalRevenue: randomInt(2500000, 4200000),
  productionYoY: roundTo(randomFloat(-12, 18)),
  salesYoY: roundTo(randomFloat(-10, 20)),
  revenueYoY: roundTo(randomFloat(-8, 22)),
  productionMoM: roundTo(randomFloat(-6, 10)),
  salesMoM: roundTo(randomFloat(-7, 11)),
  revenueMoM: roundTo(randomFloat(-5, 13)),
  qualityPassRate: roundTo(randomFloat(95, 99.6, 2)),
  qualityPassRateYoY: roundTo(randomFloat(-2, 3, 2)),
  averageSatisfaction: roundTo(randomFloat(86, 96, 2)),
  satisfactionYoY: roundTo(randomFloat(-3, 4, 2)),
  alertCount: randomInt(120, 380),
  resolvedAlertCount: randomInt(90, 340),
  enterpriseCount: randomInt(15000, 22000),
  topProvince: randomPick(PROVINCES).name,
  topBrand: randomPick(BRANDS).name,
});

export const generateAllMockData = () => ({
  users: generateUsers(15),
  kpiData: generateKPIData(),
  provinceData: generateProvinceData(),
  brandRankings: generateBrandRankings(),
  alerts: generateAlerts(18),
  productionPlans: generateProductionPlans(20),
  monthlyTargets: generateMonthlyTargets(12),
  prediction: generatePrediction(90),
  inventoryStrategies: generateInventoryStrategies(25),
  enterprises: generateEnterprises(50),
  weeklyReports: generateWeeklyReports(8),
  qualityAnalysis: generateQualityAnalysis(10),
  brandSatisfactions: generateBrandSatisfactions(20),
  dataStreams: generateDataStreams(60),
  reportMetrics: generateReportMetrics(),
});

export const ROLES_LOGIN = [
  { value: 'super_admin', label: '国家管理员', desc: '国家级监管部门' },
  { value: 'province_manager', label: '省局管理员', desc: '省级监管部门' },
  { value: 'city_manager', label: '市局管理员', desc: '市级监管部门' },
  { value: 'national_manager', label: '酒企总监', desc: '酒类生产企业' },
  { value: 'viewer', label: '流通商', desc: '酒类流通企业' }
];

export const ALERT_TYPES = [
  { value: 'quality', label: '质量预警', color: 'red' },
  { value: 'inventory', label: '库存预警', color: 'orange' }
];

export const ALERT_LEVELS = [
  { value: 'critical', label: '一级预警', color: '#ff4d4f' },
  { value: 'danger', label: '一级预警', color: '#ff4d4f' },
  { value: 'warning', label: '二级预警', color: '#fa8c16' },
  { value: 'info', label: '二级预警', color: '#fa8c16' }
];

export const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface KPICompatible {
  key: string;
  label: string;
  value: string;
  trend: number;
  unit: string;
  icon: string;
}

export const generateKPI = (): KPICompatible[] => {
  const k = generateKPIData();
  return [
    { key: 'total_production', label: '总产量', value: String(k.totalProduction.value), trend: k.totalProduction.yoy, unit: '万千升', icon: 'Factory' },
    { key: 'total_sales', label: '总销量', value: String(k.totalSales.value), trend: k.totalSales.yoy, unit: '万千升', icon: 'ShoppingCart' },
    { key: 'sales_rate', label: '产销率', value: ((k.totalSales.value / k.totalProduction.value) * 100).toFixed(1), trend: randomFloat(-2, 5), unit: '%', icon: 'TrendingUp' },
    { key: 'inventory_turnover', label: '库存周转天数', value: String(k.inventoryDays.value), trend: k.inventoryDays.yoy, unit: '天', icon: 'Package' },
    { key: 'quality_pass', label: '质量合格率', value: String(k.qualityPassRate.value), trend: k.qualityPassRate.yoy, unit: '%', icon: 'ShieldCheck' },
    { key: 'alerts', label: '预警数', value: String(k.alertCount.value), trend: k.alertCount.yoy, unit: '条', icon: 'AlertTriangle' }
  ];
};

export const generateQualityRank = generateBrandRankings;

export const generateTrendData = (days: number = 7) => {
  const dates: string[] = getLastNDays(days);
  const sales: number[] = [];
  const production: number[] = [];
  const rate: number[] = [];
  for (let i = 0; i < days; i++) {
    sales.push(randomInt(80, 180));
    production.push(randomInt(90, 200));
    rate.push(roundTo(randomFloat(88, 98), 1));
  }
  return { dates: dates.map(d => d.slice(5)), sales, production, rate };
};

export const generateDataStream = (count: number = 15) => {
  const streams = generateDataStreams(count * 2);
  return streams.slice(0, count).map(s => ({
    id: s.id,
    time: s.timestamp.slice(11, 19),
    event: s.metricName,
    enterprise: s.enterpriseName,
    province: s.provinceName,
    status: s.status === 'normal' ? 'success' : s.status === 'warning' ? 'processing' : 'warning'
  }));
};

export const generateProvinceDetail = (_name: string) => {
  const provinces = generateProvinceData();
  const p = randomPick(provinces);
  return {
    name: p.name,
    production: p.production.value,
    sales: p.sales.value,
    qualityRate: String(p.qualityPassRate.value),
    enterprises: p.enterpriseCount,
    cities: p.cities.map(c => ({
      name: c.name,
      production: c.production,
      sales: c.sales,
      qualityRate: String(c.qualityPassRate)
    })),
    qualityDistribution: [
      { name: '酒精度超标', value: randomInt(5, 60) },
      { name: '总酸不合格', value: randomInt(5, 60) },
      { name: '总酯偏低', value: randomInt(5, 60) },
      { name: '固形物超标', value: randomInt(5, 60) },
      { name: '甲醇超标', value: randomInt(5, 60) },
      { name: '杂醇油偏高', value: randomInt(5, 60) }
    ]
  };
};

export const generateAlertStats = () => {
  const alerts = generateAlerts(60);
  const l1 = alerts.filter(a => a.level === 'critical' || a.level === 'danger').length;
  const l2 = alerts.filter(a => a.level === 'warning' || a.level === 'info').length;
  const pending = alerts.filter(a => a.status === 'pending' || a.status === 'approved').length;
  const resolved = alerts.filter(a => a.status === 'resolved' || a.status === 'closed').length;
  return [
    { label: '一级预警', value: l1, color: '#ff4d4f' },
    { label: '二级预警', value: l2, color: '#fa8c16' },
    { label: '待审批', value: pending, color: '#1677ff' },
    { label: '已解决', value: resolved, color: '#52c41a' }
  ];
};

export const generateAlertList = (count: number = 30) => {
  const alerts = generateAlerts(count);
  const levelColorMap: Record<string, string> = { critical: '#ff4d4f', danger: '#ff4d4f', warning: '#fa8c16', info: '#fa8c16' };
  const levelLabelMap: Record<string, string> = { critical: '一级预警', danger: '一级预警', warning: '二级预警', info: '二级预警' };
  const statusColorMap: Record<string, string> = {
    pending: 'processing', approved: 'warning', processing: 'warning',
    resolved: 'success', closed: 'success', rejected: 'error'
  };
  const statusLabelMap: Record<string, string> = {
    pending: '待审批', approved: '审批中', processing: '处理中',
    resolved: '已解决', closed: '已关闭', rejected: '已驳回'
  };
  return alerts.map((a, idx) => ({
    key: idx + 1,
    id: a.alertNo,
    type: a.type,
    typeLabel: a.typeName,
    level: a.level,
    levelLabel: levelLabelMap[a.level] || '二级预警',
    levelColor: levelColorMap[a.level] || '#fa8c16',
    title: a.title,
    enterprise: a.enterpriseName,
    brand: a.brandName,
    province: a.provinceName,
    triggerTime: a.createdAt,
    status: a.status,
    statusLabel: statusLabelMap[a.status] || a.status,
    statusColor: statusColorMap[a.status] || 'default'
  }));
};

export const generateAlertDetail = (_alertId: string) => {
  const dates = getLastNDays(30);
  const threshold = 1.0;
  const metrics = dates.map(d => ({
    date: d.slice(5),
    value: roundTo(randomFloat(0.5, 1.5), 3),
    threshold
  }));
  return {
    id: _alertId,
    metrics,
    approvals: [
      { role: '企业负责人', user: '张经理', time: formatDateTime(randomDateTime(date().subtract(3, 'day'), date().subtract(2, 'day'))).slice(0, 16), status: 'approved', comment: '情况属实，报请上级审批' },
      { role: '市局监管员', user: '李主任', time: formatDateTime(randomDateTime(date().subtract(2, 'day'), date().subtract(1, 'day'))).slice(0, 16), status: 'approved', comment: '同意处理方案，转省局' },
      { role: '省局审批', user: '王处长', time: null, status: 'pending', comment: '' }
    ],
    logs: Array.from({ length: 8 }, (_, i) => ({
      time: formatDateTime(date().subtract(i * 6, 'hour')),
      user: randomPick(['系统', '张经理', '李主任', '王处长', '赵工']),
      action: randomPick(['创建预警记录', '上传质检报告', '更新预警状态', '提交审批申请', '添加备注', '修改处理方案', '审批通过', '查看详情']),
      detail: randomPick(['系统自动触发', '经现场核查确认', '按规定流程办理', '需要进一步评估', ''])
    })),
    description: '本批次产品经抽样检测，关键指标超出国家标准阈值范围，建议立即采取限产或召回措施，防止问题产品流入市场造成安全隐患。',
    batchNo: `BATCH-${randomInt(100000, 999999)}`,
    productCount: randomInt(100, 5000),
    affectedArea: randomPick(['华东地区', '华北地区', '全国范围', '部分省市'])
  };
};
