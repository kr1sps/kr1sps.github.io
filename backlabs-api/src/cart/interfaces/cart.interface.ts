import { CartItem } from '../entities/cart-item.entity';

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
