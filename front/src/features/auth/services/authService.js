import { apiClient } from '../../../lib/api-client';
export const authService = {
    async login(data) {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },
    async register(data) {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
    async getProfile() {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },
};
