import { axiosInstance } from '../../api/axios';
import type { CreateCategoryDTO, UpdateCategoryDTO, CategoriesResponse, CategoryResponse } from './categories.types';

export const categoriesApi = {
  getAll: async (includeInactive = false): Promise<CategoriesResponse> => {
    const response = await axiosInstance.get<CategoriesResponse>('/categories', {
      params: { includeInactive },
    });
    return response.data;
  },

  getById: async (id: string): Promise<CategoryResponse> => {
    const response = await axiosInstance.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDTO): Promise<CategoryResponse> => {
    const response = await axiosInstance.post<CategoryResponse>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDTO): Promise<CategoryResponse> => {
    const response = await axiosInstance.patch<CategoryResponse>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
