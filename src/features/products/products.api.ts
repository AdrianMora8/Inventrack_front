import { axiosInstance } from '../../api/axios';
import type { CreateProductDTO, UpdateProductDTO, ProductsResponse, ProductResponse, ProductFilters } from './products.types';

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params: any = {};
    
    if (filters?.name) params.name = filters.name;
    if (filters?.sku) params.sku = filters.sku;
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    
    const response = await axiosInstance.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const response = await axiosInstance.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDTO): Promise<ProductResponse> => {
    const response = await axiosInstance.post<ProductResponse>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDTO): Promise<ProductResponse> => {
    const response = await axiosInstance.patch<ProductResponse>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};
