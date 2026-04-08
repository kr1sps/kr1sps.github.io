export type UserRole = 'admin' | 'customer';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}