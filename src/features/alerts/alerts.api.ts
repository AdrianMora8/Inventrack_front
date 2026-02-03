import { axiosInstance } from '../../api/axios';
import type { 
  AlertsResponse, 
  AlertStatsResponse, 
  AlertRulesResponse,
  AlertRule,
  CreateAlertRuleDTO,
  UpdateAlertRuleDTO
} from './alerts.types';

export const alertsApi = {
  getAll: async (resolved?: boolean): Promise<AlertsResponse> => {
    const params: any = {};
    if (resolved !== undefined) params.resolved = resolved;
    
    const response = await axiosInstance.get<AlertsResponse>('/alerts', { params });
    return response.data;
  },

  getStats: async (): Promise<AlertStatsResponse> => {
    const response = await axiosInstance.get<AlertStatsResponse>('/alerts/stats');
    return response.data;
  },

  resolve: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await axiosInstance.patch(`/alerts/${id}/resolve`);
    return response.data;
  },

  // Alert Rules
  getAllRules: async (): Promise<AlertRulesResponse> => {
    const response = await axiosInstance.get('/alerts/rules');
    return response.data.data; // Extract data from wrapper
  },

  getRuleById: async (id: string): Promise<AlertRule> => {
    const response = await axiosInstance.get(`/alerts/rules/${id}`);
    return response.data.data; // Extract data from wrapper
  },

  createRule: async (data: CreateAlertRuleDTO): Promise<AlertRule> => {
    const response = await axiosInstance.post('/alerts/rules', data);
    return response.data.data; // Extract data from wrapper
  },

  updateRule: async (id: string, data: UpdateAlertRuleDTO): Promise<AlertRule> => {
    const response = await axiosInstance.patch(`/alerts/rules/${id}`, data);
    return response.data.data; // Extract data from wrapper
  },

  deleteRule: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/alerts/rules/${id}`);
  },
};
