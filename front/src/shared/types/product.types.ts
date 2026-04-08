import type {BaseEntity, ID} from './common.types'

export interface Category extends BaseEntity {
    name: string
    description?: string
    parentId?: ID | null
}

export interface Product extends BaseEntity {
    name: string
    description: string
    price: number
    stock: number
    categoryId: ID
    imageUrls: string[]
    sku: string
    isActive: boolean
}

// Для фильтрации товаров в каталоге
export interface ProductFilter {
    categoryId?: ID
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    search?: string
    page?: number
    limit?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}