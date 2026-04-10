import { apiClient } from '../../../lib/api-client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../../../shared/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; address?: string; phone?: string }) {
    const response = await apiClient.patch<User>('/auth/profile', data);
    return response.data;
  },
};