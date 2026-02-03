import { axiosInstance } from '../../api/axios';
import type { 
  CreateMovementDTO, 
  InventoryResponse, 
  MovementsResponse, 
  MovementResponse,
  InventoryFilters,
  MovementFilters,
  InventoryItem
} from './inventory.types';

export const inventoryApi = {
  // Inventory endpoints
  getInventory: async (filters?: InventoryFilters): Promise<InventoryResponse> => {
    const params: any = {};
    
    if (filters?.productName) params.productName = filters.productName;
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.minStock !== undefined) params.minStock = filters.minStock;
    if (filters?.maxStock !== undefined) params.maxStock = filters.maxStock;
    
    const response = await axiosInstance.get<InventoryResponse>('/inventory/stock/all', { params });
    return response.data;
  },

  getProductStock: async (productId: string): Promise<{ success: boolean; data: InventoryItem }> => {
    const response = await axiosInstance.get(`/inventory/stock/${productId}`);
    return response.data;
  },

  // Movements endpoints
  getMovements: async (filters?: MovementFilters): Promise<MovementsResponse> => {
    const params: any = {};
    
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.type) params.type = filters.type;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    
    const response = await axiosInstance.get<MovementsResponse>('/inventory', { params });
    return response.data;
  },

  createMovement: async (data: CreateMovementDTO): Promise<MovementResponse> => {
    const response = await axiosInstance.post<MovementResponse>('/inventory', data);
    return response.data;
  },
};
