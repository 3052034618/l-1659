import type { RoleType } from '../constants/config';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role: RoleType;
  email: string;
  phone?: string;
  provinceCode?: string;
  cityCode?: string;
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface YoYMoM {
  value: number;
  yoy: number;
  mom: number;
}

export interface KPIData {
  totalProduction: YoYMoM;
  totalSales: YoYMoM;
  totalRevenue: YoYMoM;
  qualityPassRate: YoYMoM;
  averageSatisfaction: YoYMoM;
  inventoryDays: YoYMoM;
  activeEnterprises: YoYMoM;
  alertCount: YoYMoM;
}

export interface MetricPoint {
  date: string;
  value: number;
  yoy?: number;
  mom?: number;
}

export interface CityData {
  code: string;
  name: string;
  production: number;
  sales: number;
  revenue: number;
  qualityPassRate: number;
  enterprises: number;
  brands: number;
}

export interface ProvinceData {
  code: string;
  name: string;
  shortName: string;
  production: YoYMoM;
  sales: YoYMoM;
  revenue: YoYMoM;
  qualityPassRate: YoYMoM;
  satisfaction: YoYMoM;
  inventoryDays: YoYMoM;
  cities: CityData[];
  productionTrend: MetricPoint[];
  salesTrend: MetricPoint[];
  topBrands: BrandBrief[];
  enterpriseCount: number;
  brandCount: number;
}

export interface BrandBrief {
  id: string;
  name: string;
  provinceName: string;
  category: string;
  alcoholContent: number;
  rank: number;
  score: number;
  marketShare: number;
  sales: number;
  satisfaction: number;
  production: number;
  trend: 'up' | 'down' | 'stable';
}

export interface QualityIssue {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  brandId: string;
  brandName: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  issueType: string;
  issueTypeName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  batchNo: string;
  productDate: string;
  detectedValue: number;
  standardValue: string;
  description: string;
  detectedAt: string;
  inspector: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
}

export interface ApprovalStep {
  id: string;
  alertId: string;
  level: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface ActionPlan {
  id: string;
  alertId: string;
  title: string;
  description: string;
  responsibleId: string;
  responsibleName: string;
  deadline: string;
  startDate: string;
  endDate?: string;
  progress: number;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  createdAt: string;
  updatedAt: string;
}

export type AlertType =
  | 'quality'
  | 'production'
  | 'inventory'
  | 'sales'
  | 'satisfaction'
  | 'compliance';

export type AlertLevel = 'info' | 'warning' | 'danger' | 'critical';

export type AlertStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'resolved'
  | 'rejected'
  | 'closed';

export interface Alert {
  id: string;
  alertNo: string;
  type: AlertType;
  typeName: string;
  level: AlertLevel;
  status: AlertStatus;
  title: string;
  description: string;
  provinceCode: string;
  provinceName: string;
  cityCode?: string;
  cityName?: string;
  enterpriseId?: string;
  enterpriseName?: string;
  brandId?: string;
  brandName?: string;
  indicatorValue: number;
  thresholdValue: number;
  deviation: number;
  riskScore: number;
  createdAt: string;
  createdBy: string;
  approvedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  qualityIssues?: QualityIssue[];
  approvalSteps: ApprovalStep[];
  currentApprovalLevel: number;
  actionPlans?: ActionPlan[];
  relatedAlerts?: string[];
}

export interface AlertLog {
  id: string;
  alertId: string;
  action: string;
  actionName: string;
  operatorId: string;
  operatorName: string;
  comment?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface ProductionPlan {
  id: string;
  planNo: string;
  enterpriseId: string;
  enterpriseName: string;
  brandId: string;
  brandName: string;
  provinceCode: string;
  provinceName: string;
  year: number;
  month: number;
  plannedVolume: number;
  actualVolume: number;
  completionRate: number;
  status: 'draft' | 'approved' | 'executing' | 'completed' | 'adjusted';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyTarget {
  id: string;
  year: number;
  month: number;
  provinceCode?: string;
  provinceName?: string;
  productionTarget: number;
  salesTarget: number;
  revenueTarget: number;
  qualityTarget: number;
  satisfactionTarget: number;
  productionActual?: number;
  salesActual?: number;
  revenueActual?: number;
  qualityActual?: number;
  satisfactionActual?: number;
}

export interface ForecastDay {
  date: string;
  forecastProduction: number;
  forecastSales: number;
  forecastRevenue: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface PredictionResult {
  id: string;
  modelName: string;
  provinceCode?: string;
  provinceName?: string;
  brandId?: string;
  brandName?: string;
  startDate: string;
  endDate: string;
  forecastDays: ForecastDay[];
  accuracy: number;
  rmse: number;
  mae: number;
  createdAt: string;
}

export interface InventoryStrategy {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  brandId: string;
  brandName: string;
  safeInventory: number;
  maxInventory: number;
  minInventory: number;
  currentInventory: number;
  turnoverDays: number;
  suggestedAction: 'increase' | 'decrease' | 'maintain';
  lastUpdated: string;
}

export interface ReportMetrics {
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  productionYoY: number;
  salesYoY: number;
  revenueYoY: number;
  productionMoM: number;
  salesMoM: number;
  revenueMoM: number;
  qualityPassRate: number;
  qualityPassRateYoY: number;
  averageSatisfaction: number;
  satisfactionYoY: number;
  alertCount: number;
  resolvedAlertCount: number;
  enterpriseCount: number;
  topProvince: string;
  topBrand: string;
}

export interface WeeklyReport {
  id: string;
  reportNo: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  provinceCode?: string;
  provinceName?: string;
  metrics: ReportMetrics;
  highlights: string[];
  problems: string[];
  suggestions: string[];
  authorId: string;
  authorName: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface QualityAnalysis {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  provinceCode: string;
  provinceName: string;
  period: string;
  totalSamples: number;
  qualifiedSamples: number;
  passRate: number;
  passRateYoY: number;
  passRateMoM: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  topIssues: Array<{
    type: string;
    typeName: string;
    count: number;
    rate: number;
  }>;
  generatedAt: string;
}

export interface BrandSatisfaction {
  id: string;
  brandId: string;
  brandName: string;
  provinceCode?: string;
  provinceName?: string;
  period: string;
  overallScore: number;
  tasteScore: number;
  packagingScore: number;
  valueScore: number;
  serviceScore: number;
  sampleSize: number;
  scoreYoY: number;
  scoreMoM: number;
  complaints: number;
  praises: number;
}

export type EnterpriseLevel = 'national' | 'provincial' | 'municipal';
export type EnterpriseScale = 'small' | 'medium' | 'large';
export type EnterpriseStatus = 'active' | 'suspended' | 'revoked';

export interface Enterprise {
  id: string;
  name: string;
  shortName: string;
  legalPerson: string;
  unifiedCode: string;
  licenseNo: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  address: string;
  phone: string;
  email?: string;
  foundedAt: string;
  registeredCapital: number;
  employees: number;
  level: EnterpriseLevel;
  scale: EnterpriseScale;
  status: EnterpriseStatus;
  mainBrands: string[];
  mainCategories: string[];
  annualProduction: number;
  annualRevenue: number;
  qualityRating: 'A' | 'B' | 'C' | 'D';
  lastInspectionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DataStreamType =
  | 'production'
  | 'sales'
  | 'inventory'
  | 'quality'
  | 'temperature'
  | 'humidity';

export interface DataStreamRecord {
  id: string;
  timestamp: string;
  enterpriseId: string;
  enterpriseName: string;
  provinceCode: string;
  provinceName: string;
  streamType: DataStreamType;
  streamTypeName: string;
  metricName: string;
  metricValue: number;
  metricUnit: string;
  minValue?: number;
  maxValue?: number;
  threshold?: number;
  status: 'normal' | 'warning' | 'alert';
  deviceId?: string;
  deviceName?: string;
}
