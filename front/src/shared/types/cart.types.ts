import type { ID } from './common.types'

export interface CartItem {
    productId: ID
    name: string
    price: number
    quantity: number
    imageUrl?: string
    maxQuantity: number // максимальное доступное количество (stock)
}

export interface Cart {
    items: CartItem[]
    totalQuantity: number
    totalPrice: number
}

// Для добавления в корзину
export interface AddToCartPayload {
    productId: ID
    quantity: number
}