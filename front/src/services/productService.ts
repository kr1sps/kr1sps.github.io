import type { Product, Category } from '../types/product';

const mockProducts: Product[] = [
    { id: '1', name: 'Ноутбук Pro', description: 'Мощный ноутбук', price: 120000, categoryId: 'cat1', stock: 10 },
    { id: '2', name: 'Мышь беспроводная', description: 'Эргономичная', price: 3500, categoryId: 'cat2', stock: 25 },
];

const mockCategories: Category[] = [
    { id: 'cat1', name: 'Ноутбуки' },
    { id: 'cat2', name: 'Периферия' },
];

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        await delay(300);
        return [...mockProducts];
    },
    getProductById: async (id: string): Promise<Product | undefined> => {
        await delay(200);
        return mockProducts.find(p => p.id === id);
    },
    getCategories: async (): Promise<Category[]> => {
        await delay(200);
        return [...mockCategories];
    },
    // Позже здесь будут реальные axios-запросы
};