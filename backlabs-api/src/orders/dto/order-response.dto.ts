import { Expose, Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

export class OrderItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  @Expose()
  total: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  shippingAddress: string;

  @Expose()
  phone: string;

  @Expose()
  comment?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
