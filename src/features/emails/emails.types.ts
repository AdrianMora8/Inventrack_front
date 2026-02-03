export type EmailType = 'LOW_STOCK_ALERT' | 'STOCK_REPLENISHED' | 'SYSTEM_NOTIFICATION';

export interface Email {
  _id: string;
  to: string; // Es un string separado por comas, no un array
  subject: string;
  type: EmailType;
  success: boolean;
  sentAt?: string;
  error?: string;
  productName?: string;
  productSku?: string;
  createdAt: string;
}

export interface EmailFilters {
  type?: EmailType;
  startDate?: string;
  endDate?: string;
}

export interface EmailsState {
  emails: Email[];
  filters: EmailFilters;
  isLoading: boolean;
  error: string | null;
}

export interface EmailsResponse {
  success: boolean;
  data: Email[];
}

export interface EmailStatsResponse {
  success: boolean;
  data: {
    totalEmails: number;
    sentEmails: number;
    failedEmails: number;
    pendingEmails: number;
  };
}
