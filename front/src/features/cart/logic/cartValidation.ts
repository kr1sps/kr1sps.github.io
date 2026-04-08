import type {CartItem} from '../../../shared/types'

export interface CartValidationError {
    productId: string
    message: string
}

/**
 * Валидирует всю корзину на предмет превышения доступного количества
 */
export const validateCartStock = (
    items: CartItem[],
    currentStockMap: Map<string, number> // productId -> актуальный stock
): CartValidationError[] => {
    const errors: CartValidationError[] = []

    items.forEach(item => {
        const availableStock = currentStockMap.get(item.productId) ?? 0
        if (item.quantity > availableStock) {
            errors.push({
                productId: item.productId,
                message: `Доступно только ${availableStock} шт. товара "${item.name}"`,
            })
        }
    })

    return errors
}

/**
 * Проверяет минимальную сумму заказа (например, для бесплатной доставки)
 */
export const isMinimumOrderAmountMet = (total: number, minimum: number): boolean => {
    return total >= minimum
}