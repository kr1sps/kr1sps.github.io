import { apiClient } from '../../../lib/api-client';
export const orderService = {
    async createOrder(payload) {
        const response = await apiClient.post('/orders', payload);
        return response.data;
    },
    async getOrders(status) {
        const params = status ? { status } : {};
        const response = await apiClient.get('/orders', { params });
        return response.data;
    },
    async getOrderById(id) {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },
    async cancelOrder(id) {
        const response = await apiClient.delete(`/orders/${id}`);
        return response.data;
    },
};
