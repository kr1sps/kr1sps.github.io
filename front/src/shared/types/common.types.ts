export type ID = string

export type Timestamp = string // ISO 8601

export interface BaseEntity {
    id: ID
    createdAt: Timestamp
    updatedAt: Timestamp
}

// @ts-ignore
export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

// @ts-ignore
export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}