import { apiClient } from '../../../lib/api-client';
import type { Order, CreateOrderPayload } from '../../../shared/types';

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', payload);
    return response.data;
  },

  async getOrders(status?: string): Promise<Order[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<Order[]>('/orders', { params });
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await apiClient.delete<Order>(`/orders/${id}`);
    return response.data;
  },
};
