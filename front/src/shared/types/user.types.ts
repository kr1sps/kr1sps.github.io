import {type BaseEntity, UserRole } from './common.types'

export interface User extends BaseEntity {
    email: string
    name: string
    role: UserRole
    phone?: string
    address?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
    phone?: string
    address?: string
}

export interface AuthResponse {
    accessToken: string
    user: User
}