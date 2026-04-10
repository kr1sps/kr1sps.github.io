import { create } from 'zustand';
import { cartService } from '../features/cart/services/cartService';
import type { CartItem } from '../shared/types';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (item: { productId: string; quantity: number }) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const mapBackendCartToState = (data: any) => {
  return {
    items: (data.items || []).map((item: any) => ({
      productId: item.productId,
      name: item.product?.name || 'Товар больше недоступен',
      price: Number(item.product?.price) || 0,
      quantity: Number(item.quantity) || 1,
      imageUrl: item.product?.imageUrls?.[0] || 'https://via.placeholder.com/80?text=Нет+фото',
      maxQuantity: item.product?.stock || 0,
    })),
    totalQuantity: Number(data.totalQuantity) || 0,
    totalPrice: Number(data.totalPrice) || 0,
  };
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await cartService.getCart();
      set(mapBackendCartToState(data));
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async ({ productId, quantity }) => {
    console.log('📦 [СТОР] Вызываю cartService.addItem...');
    try {
      const data = await cartService.addItem(productId, quantity);
      set(mapBackendCartToState(data));
    } catch (error: any) {
      console.error('[СТОР] Ошибка:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Ошибка добавления');
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true });
    try {
      const data = await cartService.removeItem(productId);
      set(mapBackendCartToState(data));
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      set(mapBackendCartToState(data));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка обновления количества');
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      const data = await cartService.clearCart();
      set(mapBackendCartToState(data));
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));