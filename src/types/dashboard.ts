export interface IDashboardStats {
  totalUsers: number;
  activeProjects: number;
  completedTasks: number;
  totalRevenue: number;
}

export interface IMonthlyRevenue {
  month: number;
  year: number;
  revenue: number;
}

export interface IChartPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ISubscriptionDistribution {
  plan: string;
  count: number;
}
