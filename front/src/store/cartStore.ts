import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../shared/types';
import {
  calculateTotalPrice,
  calculateTotalQuantity,
  mergeCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
} from '../features/cart/logic/cartCalculations';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;

  addItem: (item: Omit<CartItem, 'quantity'> & { quantity: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        const currentItems = get().items;
        try {
          const updatedItems = mergeCartItem(currentItems, newItem);
          set({
            items: updatedItems,
            totalQuantity: calculateTotalQuantity(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
          });
        } catch (error) {
          console.error('Ошибка добавления в корзину:', error);
          throw error;
        }
      },

      removeItem: (productId) => {
        const currentItems = get().items;
        const updatedItems = removeCartItem(currentItems, productId);
        set({
          items: updatedItems,
          totalQuantity: calculateTotalQuantity(updatedItems),
          totalPrice: calculateTotalPrice(updatedItems),
        });
      },

      updateQuantity: (productId, quantity) => {
        const currentItems = get().items;
        try {
          const updatedItems = updateCartItemQuantity(currentItems, productId, quantity);
          set({
            items: updatedItems,
            totalQuantity: calculateTotalQuantity(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
          });
        } catch (error) {
          console.error('Ошибка обновления количества:', error);
          throw error;
        }
      },

      clearCart: () => {
        set({
          items: clearCart(),
          totalQuantity: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);