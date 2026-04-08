import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { keepPreviousData } from '@tanstack/react-query';
export const productKeys = {
    all: ['products'],
    lists: () => [...productKeys.all, 'list'],
    list: (filters, sort) => [...productKeys.lists(), { filters, sort }],
    details: () => [...productKeys.all, 'detail'],
    detail: (id) => [...productKeys.details(), id],
    categories: ['categories'],
};
export const useProducts = (filter, sort) => {
    return useQuery({
        queryKey: productKeys.list(filter || {}, sort),
        queryFn: () => productService.getProducts(filter, sort),
        placeholderData: keepPreviousData,
    });
};
export const useProduct = (id) => {
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
