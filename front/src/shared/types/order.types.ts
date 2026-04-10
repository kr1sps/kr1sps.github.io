import type { BaseEntity, ID, OrderStatus } from './common.types'

export interface OrderItem {
    productId: ID
    name: string
    price: number
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
    items: Omit<OrderItem, 'name' | 'price'>[]
    shippingAddress: string
    phone: string
    comment?: string
}