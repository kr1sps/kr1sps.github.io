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
import { CartResponse } from './interfaces/cart.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  private mapToResponse(cart: Cart): CartResponse {
    const items = (cart.items as unknown as CartItem[]) ?? [];

    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity),
      0,
    );

    const totalPrice = items.reduce((sum, item) => {
      const price = item.product ? Number(item.product.price) : 0;
      return sum + price * Number(item.quantity);
    }, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalQuantity,
      totalPrice,
    };
  }

  private async findOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async getCart(userId: string): Promise<CartResponse> {
    const cart = await this.findOrCreateCart(userId);
    return this.mapToResponse(cart);
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.findOrCreateCart(userId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Товар не найден');

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    const currentQuantity = cartItem ? Number(cartItem.quantity) : 0;
    const newQuantity = currentQuantity + Number(quantity);

    if (newQuantity > product.stock) {
      throw new BadRequestException(`Доступно только ${product.stock} шт.`);
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
    const cart = await this.findOrCreateCart(userId);

    if (quantity <= 0) return this.removeItem(userId, productId);

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (product && quantity > product.stock) {
      throw new BadRequestException(`Максимально доступно: ${product.stock}`);
    }

    await this.cartItemRepository.update(
      { cartId: cart.id, productId },
      { quantity },
    );

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartResponse> {
    const cart = await this.findOrCreateCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id, productId });
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponse> {
    const cart = await this.findOrCreateCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
    return this.getCart(userId);
  }
}
