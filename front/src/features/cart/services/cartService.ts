import { apiClient } from '../../../lib/api-client';

export const cartService = {
  async getCart() {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  async addItem(productId: string, quantity: number) {
    const response = await apiClient.post('/cart/items', { productId, quantity });
    return response.data;
  },

  async updateQuantity(productId: string, quantity: number) {
    const response = await apiClient.patch(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  async removeItem(productId: string) {
    const response = await apiClient.delete(`/cart/items/${productId}`);
    return response.data;
  },

  async clearCart() {
    const response = await apiClient.delete('/cart');
    return response.data;
  },
};