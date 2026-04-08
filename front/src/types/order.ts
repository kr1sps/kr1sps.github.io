export interface OrderItem {
    productId: string;
    quantity: number;
    price: number; // цена на момент заказа
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'paid' | 'shipped';
    createdAt: string;
}