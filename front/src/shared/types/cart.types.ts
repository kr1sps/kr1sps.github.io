import type { ID } from './common.types'

export interface CartItem {
    productId: ID
    name: string
    price: number
    quantity: number
    imageUrl?: string
    maxQuantity: number
}

export interface Cart {
    items: CartItem[]
    totalQuantity: number
    totalPrice: number
}

export interface AddToCartPayload {
    productId: ID
    quantity: number
}