export interface Alert {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  threshold: number;
  currentStock: number;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
}

export interface AlertRule {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  minStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRuleDTO {
  productId: string;
  minStockThreshold: number;
  isActive?: boolean;
}

export interface UpdateAlertRuleDTO {
  minStockThreshold?: number;
  isActive?: boolean;
}

export interface AlertsState {
  alerts: Alert[];
  activeAlerts: Alert[];
  resolvedAlerts: Alert[];
  alertRules: AlertRule[];
  currentRule: AlertRule | null;
  isLoading: boolean;
  error: string | null;
}

export interface AlertsResponse {
  success: boolean;
  data: Alert[];
}

export interface AlertRulesResponse extends Array<AlertRule> {}

export interface AlertStatsResponse {
  success: boolean;
  data: {
    totalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
  };
}
