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