import { apiClient } from '../../../lib/api-client';
export const productService = {
    async getCategories() {
        const response = await apiClient.get('/categories');
        return response.data;
    },
    async getProducts(filter, sort) {
        const params = { ...filter };
        if (sort) {
            params.sort = sort;
        }
        const response = await apiClient.get('/products', { params });
        return response.data;
    },
    async getProductById(id) {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },
    async createProduct(data) {
        const response = await apiClient.post('/products', data);
        return response.data;
    },
    async updateProduct(id, data) {
        const response = await apiClient.patch(`/products/${id}`, data);
        return response.data;
    },
    async deleteProduct(id) {
        await apiClient.delete(`/products/${id}`);
    },
};
