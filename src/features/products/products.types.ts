export interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  categoryId: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  sku: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface UpdateProductDTO {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  name?: string;
  sku?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}
