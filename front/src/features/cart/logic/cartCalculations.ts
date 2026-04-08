import type {CartItem} from '../../../shared/types'

/**
 * Вычисляет итоговую сумму корзины
 */
export const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

/**
 * Вычисляет общее количество товаров в корзине
 */
export const calculateTotalQuantity = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0)
}

/**
 * Применяет скидку (процент) к сумме
 */
export const applyDiscount = (price: number, discountPercent: number): number => {
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Процент скидки должен быть от 0 до 100')
    }
    return price * (1 - discountPercent / 100)
}

/**
 * Форматирует цену в рубли
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    }).format(price)
}

/**
 * Проверяет, можно ли добавить товар в корзину (не превышает ли запрашиваемое количество сток)
 */
export const canAddToCart = (currentQuantity: number, addQuantity: number, maxStock: number): boolean => {
    return currentQuantity + addQuantity <= maxStock
}

/**
 * Создаёт новый элемент корзины или обновляет существующий
 */
export const mergeCartItem = (
    existingItems: CartItem[],
    newItem: Omit<CartItem, 'quantity'> & { quantity: number }
): CartItem[] => {
    const existingItemIndex = existingItems.findIndex(item => item.productId === newItem.productId)

    if (existingItemIndex === -1) {
        return [...existingItems, {...newItem}]
    }

    const updatedItems = [...existingItems]
    const currentItem = updatedItems[existingItemIndex]
    const newQuantity = currentItem.quantity + newItem.quantity

    if (newQuantity > newItem.maxQuantity) {
        throw new Error(`Нельзя добавить больше ${newItem.maxQuantity} шт.`)
    }

    updatedItems[existingItemIndex] = {
        ...currentItem,
        quantity: newQuantity,
    }

    return updatedItems
}

/**
 * Удаляет товар из корзины по productId
 */
export const removeCartItem = (items: CartItem[], productId: string): CartItem[] => {
    return items.filter(item => item.productId !== productId)
}

/**
 * Изменяет количество конкретного товара в корзине
 */
export const updateCartItemQuantity = (
    items: CartItem[],
    productId: string,
    newQuantity: number
): CartItem[] => {
    if (newQuantity <= 0) {
        return removeCartItem(items, productId)
    }

    const itemIndex = items.findIndex(item => item.productId === productId)
    if (itemIndex === -1) return items

    const item = items[itemIndex]
    if (newQuantity > item.maxQuantity) {
        throw new Error(`Доступно только ${item.maxQuantity} шт.`)
    }

    const updatedItems = [...items]
    updatedItems[itemIndex] = {...item, quantity: newQuantity}
    return updatedItems
}

/**
 * Очищает корзину
 */
export const clearCart = (): CartItem[] => {
    return []
}

/**
 * Проверяет, применим ли промокод (упрощённая логика)
 */
export const validatePromoCode = (code: string): { valid: boolean; discountPercent: number } => {
    const promoCodes: Record<string, number> = {
        'SALE10': 10,
        'SALE20': 20,
        'WELCOME': 5,
    }

    const upperCode = code.toUpperCase()
    if (promoCodes[upperCode] !== undefined) {
        return {valid: true, discountPercent: promoCodes[upperCode]}
    }
    return {valid: false, discountPercent: 0}
}