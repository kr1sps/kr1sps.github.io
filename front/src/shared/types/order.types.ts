import type { BaseEntity, ID, OrderStatus } from './common.types'

export interface OrderItem {
    productId: ID
    name: string
    price: number // цена на момент заказа
    quantity: number
}

export interface Order extends BaseEntity {
    userId: ID
    items: OrderItem[]
    total: number
    status: OrderStatus
    shippingAddress: string
    phone: string
    comment?: string
}

export interface CreateOrderPayload {
    items: Omit<OrderItem, 'name' | 'price'>[] // только productId и quantity
    shippingAddress: string
    phone: string
    comment?: string
}