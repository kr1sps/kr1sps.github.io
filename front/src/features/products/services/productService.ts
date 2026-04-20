import { apiClient } from '../../../lib/api-client';
import type { Product, Category, PaginatedResponse, ProductFilter } from '../../../shared/types';
import { SortOption } from '../enums/SortOption.ts';

export const productService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async getProducts(filter?: ProductFilter, sort?: SortOption): Promise<PaginatedResponse<Product>> {
    const params: ProductFilter & { sort?: SortOption } = { ...filter };

    if (sort) {
      params.sort = sort;
    }

    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
