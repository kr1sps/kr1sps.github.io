export type ID = string

export type Timestamp = string

export interface BaseEntity {
    id: ID
    createdAt: Timestamp
    updatedAt: Timestamp
}

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface BackendCartItem {
    productId: string;
    quantity: number;
    product?: {
        name: string;
        price: number | string;
        imageUrls?: string[];
        stock: number;
    };
}

export interface BackendCartResponse {
    items: BackendCartItem[];
    totalQuantity: number;
    totalPrice: number;
}

export interface CartItemState {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    maxQuantity: number;
}