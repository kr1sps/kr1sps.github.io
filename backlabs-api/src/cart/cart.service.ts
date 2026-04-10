import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string): Promise<CartResponse> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    const items: CartItem[] = (cart.items as unknown as CartItem[]) ?? [];

    const totalQuantity: number = items.reduce(
      (sum: number, item: CartItem) => sum + item.quantity,
      0,
    );

    const totalPrice: number = items.reduce((sum: number, item: CartItem) => {
      const productPrice = item.product ? Number(item.product.price) : 0;
      return sum + productPrice * Number(item.quantity);
    }, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items: items,
      totalQuantity,
      totalPrice,
    };
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    let cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    const newQuantity: number = cartItem
      ? Number(cartItem.quantity) + Number(quantity)
      : Number(quantity);

    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Нельзя добавить больше. Доступно: ${product.stock} шт.`,
      );
    }

    if (cartItem) {
      cartItem.quantity = newQuantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Корзина не найдена');

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Товар не найден');

    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Максимальное доступное количество: ${product.stock} шт.`,
      );
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (cart) {
      await this.cartItemRepository.delete({ cartId: cart.id, productId });
    }
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (cart) {
      await this.cartItemRepository.delete({ cartId: cart.id });
    }
    return this.getCart(userId);
  }
}
