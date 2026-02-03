import { axiosInstance } from '../../api/axios';
import type { EmailsResponse, EmailStatsResponse, EmailFilters } from './emails.types';

export const emailsApi = {
  getAll: async (filters?: EmailFilters): Promise<EmailsResponse> => {
    const params: any = {};
    
    if (filters?.type) params.type = filters.type;
    if (filters?.status) params.status = filters.status;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    
    const response = await axiosInstance.get<EmailsResponse>('/emails', { params });
    console.log('📧 FRONTEND API - Received response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  getStats: async (): Promise<EmailStatsResponse> => {
    const response = await axiosInstance.get<EmailStatsResponse>('/emails/stats');
    return response.data;
  },
};
