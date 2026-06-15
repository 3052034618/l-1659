import { create } from 'zustand';
import type {
  KPIData,
  ProvinceData,
  BrandBrief,
  ProductionPlan,
  MonthlyTarget,
  PredictionResult,
  InventoryStrategy,
  Enterprise,
  WeeklyReport,
  QualityAnalysis,
  BrandSatisfaction,
  DataStreamRecord,
  ReportMetrics,
  MetricPoint,
} from '../types';
import {
  generateKPIData,
  generateProvinceData,
  generateBrandRankings,
  generateProductionPlans,
  generateMonthlyTargets,
  generatePrediction,
  generateInventoryStrategies,
  generateEnterprises,
  generateWeeklyReports,
  generateQualityAnalysis,
  generateBrandSatisfactions,
  generateDataStreams,
  generateReportMetrics,
  generateMetricPoints,
} from '../utils/mock';
import { PROVINCES } from '../constants/regions';

interface DashboardFilter {
  selectedProvinceCode: string | null;
  selectedCityCode: string | null;
  selectedBrandIds: string[];
  selectedCategories: string[];
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  startDate?: string;
  endDate?: string;
}

interface DashboardState {
  isLoading: boolean;
  kpiData: KPIData | null;
  provinceData: ProvinceData[];
  brandRankings: BrandBrief[];
  productionPlans: ProductionPlan[];
  monthlyTargets: MonthlyTarget[];
  prediction: PredictionResult | null;
  inventoryStrategies: InventoryStrategy[];
  enterprises: Enterprise[];
  weeklyReports: WeeklyReport[];
  qualityAnalysis: QualityAnalysis[];
  brandSatisfactions: BrandSatisfaction[];
  dataStreams: DataStreamRecord[];
  reportMetrics: ReportMetrics | null;

  productionTrend: MetricPoint[];
  salesTrend: MetricPoint[];
  revenueTrend: MetricPoint[];

  filter: DashboardFilter;

  loadAllData: () => void;
  loadKPIData: () => void;
  loadProvinceData: () => void;
  loadBrandRankings: () => void;
  loadProductionPlans: () => void;
  loadMonthlyTargets: () => void;
  loadPrediction: (days?: number) => void;
  loadInventoryStrategies: () => void;
  loadEnterprises: () => void;
  loadWeeklyReports: () => void;
  loadQualityAnalysis: () => void;
  loadBrandSatisfactions: () => void;
  loadDataStreams: () => void;
  refreshDataStream: () => DataStreamRecord | null;

  setSelectedProvince: (code: string | null) => void;
  setSelectedCity: (code: string | null) => void;
  setSelectedBrands: (ids: string[]) => void;
  toggleSelectedBrand: (brandId: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setDateRange: (range: DashboardFilter['dateRange']) => void;
  setFilter: (updates: Partial<DashboardFilter>) => void;
  resetFilter: () => void;

  getProvinceDataByCode: (code: string) => ProvinceData | undefined;
  getCurrentProvinceData: () => ProvinceData | null;
  getFilteredProvinces: () => ProvinceData[];
  getFilteredBrandRankings: () => BrandBrief[];
  getFilteredEnterprises: () => Enterprise[];
  getFilteredProductionPlans: () => ProductionPlan[];
  getFilteredWeeklyReports: () => WeeklyReport[];
  getTopProvinces: (limit?: number, sortBy?: keyof Pick<ProvinceData, 'production' | 'sales' | 'revenue'>) => ProvinceData[];
  getTopBrands: (limit?: number) => BrandBrief[];

  getNationalSummary: () => {
    totalProduction: number;
    totalSales: number;
    totalRevenue: number;
    avgQualityPassRate: number;
    avgSatisfaction: number;
    totalEnterprises: number;
    totalBrands: number;
  };
}

const defaultFilter: DashboardFilter = {
  selectedProvinceCode: null,
  selectedCityCode: null,
  selectedBrandIds: [],
  selectedCategories: [],
  dateRange: '30d',
};

const initialProvinceData = generateProvinceData();
const initialBrandRankings = generateBrandRankings();

export const useDashboardStore = create<DashboardState>((set, get) => ({
  isLoading: false,
  kpiData: generateKPIData(),
  provinceData: initialProvinceData,
  brandRankings: initialBrandRankings,
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
  productionTrend: generateMetricPoints(30, 8000, 18000),
  salesTrend: generateMetricPoints(30, 7500, 17500),
  revenueTrend: generateMetricPoints(30, 60000, 150000),

  filter: { ...defaultFilter },

  loadAllData: () => {
    set({ isLoading: true });
    set({
      kpiData: generateKPIData(),
      provinceData: generateProvinceData(),
      brandRankings: generateBrandRankings(),
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
      productionTrend: generateMetricPoints(30, 8000, 18000),
      salesTrend: generateMetricPoints(30, 7500, 17500),
      revenueTrend: generateMetricPoints(30, 60000, 150000),
      isLoading: false,
    });
  },

  loadKPIData: () => set({ kpiData: generateKPIData() }),

  loadProvinceData: () => set({ provinceData: generateProvinceData() }),

  loadBrandRankings: () => set({ brandRankings: generateBrandRankings() }),

  loadProductionPlans: () => set({ productionPlans: generateProductionPlans(20) }),

  loadMonthlyTargets: () => set({ monthlyTargets: generateMonthlyTargets(12) }),

  loadPrediction: (days = 90) => set({ prediction: generatePrediction(days) }),

  loadInventoryStrategies: () => set({ inventoryStrategies: generateInventoryStrategies(25) }),

  loadEnterprises: () => set({ enterprises: generateEnterprises(50) }),

  loadWeeklyReports: () => set({ weeklyReports: generateWeeklyReports(8) }),

  loadQualityAnalysis: () => set({ qualityAnalysis: generateQualityAnalysis(10) }),

  loadBrandSatisfactions: () => set({ brandSatisfactions: generateBrandSatisfactions(20) }),

  loadDataStreams: () => set({ dataStreams: generateDataStreams(60) }),

  refreshDataStream: () => {
    const newStreams = generateDataStreams(1);
    if (newStreams.length === 0) return null;
    const newRecord = newStreams[0];
    set((state) => ({
      dataStreams: [newRecord, ...state.dataStreams.slice(0, 99)],
    }));
    return newRecord;
  },

  setSelectedProvince: (code) => {
    set((state) => ({
      filter: {
        ...state.filter,
        selectedProvinceCode: code,
        selectedCityCode: null,
      },
    }));
  },

  setSelectedCity: (code) => {
    set((state) => ({
      filter: {
        ...state.filter,
        selectedCityCode: code,
      },
    }));
  },

  setSelectedBrands: (ids) => {
    set((state) => ({
      filter: {
        ...state.filter,
        selectedBrandIds: ids,
      },
    }));
  },

  toggleSelectedBrand: (brandId) => {
    set((state) => {
      const has = state.filter.selectedBrandIds.includes(brandId);
      return {
        filter: {
          ...state.filter,
          selectedBrandIds: has
            ? state.filter.selectedBrandIds.filter((id) => id !== brandId)
            : [...state.filter.selectedBrandIds, brandId],
        },
      };
    });
  },

  setSelectedCategories: (categories) => {
    set((state) => ({
      filter: {
        ...state.filter,
        selectedCategories: categories,
      },
    }));
  },

  setDateRange: (range) => {
    set((state) => ({
      filter: {
        ...state.filter,
        dateRange: range,
      },
    }));
  },

  setFilter: (updates) => {
    set((state) => ({
      filter: {
        ...state.filter,
        ...updates,
      },
    }));
  },

  resetFilter: () => {
    set({ filter: { ...defaultFilter } });
  },

  getProvinceDataByCode: (code) => get().provinceData.find((p) => p.code === code),

  getCurrentProvinceData: () => {
    const { filter, provinceData } = get();
    if (!filter.selectedProvinceCode) return null;
    return provinceData.find((p) => p.code === filter.selectedProvinceCode) || null;
  },

  getFilteredProvinces: () => {
    const { filter, provinceData } = get();
    let result = [...provinceData];

    if (filter.selectedProvinceCode) {
      result = result.filter((p) => p.code === filter.selectedProvinceCode);
    }

    return result;
  },

  getFilteredBrandRankings: () => {
    const { filter, brandRankings } = get();
    let result = [...brandRankings];

    if (filter.selectedBrandIds.length > 0) {
      result = result.filter((b) => filter.selectedBrandIds.includes(b.id));
    }

    if (filter.selectedCategories.length > 0) {
      result = result.filter((b) => filter.selectedCategories.includes(b.category));
    }

    if (filter.selectedProvinceCode) {
      const province = PROVINCES.find((p) => p.code === filter.selectedProvinceCode);
      if (province) {
        result = result.filter((b) => b.provinceName === province.name);
      }
    }

    return result;
  },

  getFilteredEnterprises: () => {
    const { filter, enterprises } = get();
    let result = [...enterprises];

    if (filter.selectedProvinceCode) {
      result = result.filter((e) => e.provinceCode === filter.selectedProvinceCode);
    }

    if (filter.selectedCityCode) {
      result = result.filter((e) => e.cityCode === filter.selectedCityCode);
    }

    if (filter.selectedBrandIds.length > 0) {
      result = result.filter((e) =>
        e.mainBrands.some((b) => filter.selectedBrandIds.includes(b))
      );
    }

    return result;
  },

  getFilteredProductionPlans: () => {
    const { filter, productionPlans } = get();
    let result = [...productionPlans];

    if (filter.selectedProvinceCode) {
      result = result.filter((p) => p.provinceCode === filter.selectedProvinceCode);
    }

    if (filter.selectedBrandIds.length > 0) {
      result = result.filter((p) => filter.selectedBrandIds.includes(p.brandId));
    }

    return result;
  },

  getFilteredWeeklyReports: () => {
    const { filter, weeklyReports } = get();
    let result = [...weeklyReports];

    if (filter.selectedProvinceCode) {
      result = result.filter(
        (r) => !r.provinceCode || r.provinceCode === filter.selectedProvinceCode
      );
    }

    return result;
  },

  getTopProvinces: (limit = 10, sortBy = 'revenue') => {
    const { provinceData } = get();
    return [...provinceData]
      .sort((a, b) => b[sortBy].value - a[sortBy].value)
      .slice(0, limit);
  },

  getTopBrands: (limit = 10) => {
    const { brandRankings } = get();
    return [...brandRankings]
      .sort((a, b) => b.rank - a.rank)
      .slice(0, limit);
  },

  getNationalSummary: () => {
    const { provinceData } = get();
    let totalProduction = 0;
    let totalSales = 0;
    let totalRevenue = 0;
    let totalQuality = 0;
    let totalSatisfaction = 0;
    let totalEnterprises = 0;
    let totalBrands = 0;

    provinceData.forEach((p) => {
      totalProduction += p.production.value;
      totalSales += p.sales.value;
      totalRevenue += p.revenue.value;
      totalQuality += p.qualityPassRate.value;
      totalSatisfaction += p.satisfaction.value;
      totalEnterprises += p.enterpriseCount;
      totalBrands += p.brandCount;
    });

    const count = provinceData.length || 1;

    return {
      totalProduction,
      totalSales,
      totalRevenue,
      avgQualityPassRate: Number((totalQuality / count).toFixed(2)),
      avgSatisfaction: Number((totalSatisfaction / count).toFixed(2)),
      totalEnterprises,
      totalBrands,
    };
  },
}));
