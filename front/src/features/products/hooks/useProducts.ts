import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductFilter } from '../../../shared/types';
import { SortOption } from '../enums/SortOption.ts';
import { keepPreviousData } from '@tanstack/react-query';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilter, sort?: SortOption) => [...productKeys.lists(), { filters, sort }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: ['categories'] as const,
};

export const useProducts = (filter?: ProductFilter, sort?: SortOption) => {
  return useQuery({
    queryKey: productKeys.list(filter || {}, sort),
    queryFn: () => productService.getProducts(filter, sort),
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: () => productService.getCategories(),
  });
};