/**
 * Валидирует всю корзину на предмет превышения доступного количества
 */
export const validateCartStock = (items, currentStockMap // productId -> актуальный stock
) => {
    const errors = [];
    items.forEach(item => {
        const availableStock = currentStockMap.get(item.productId) ?? 0;
        if (item.quantity > availableStock) {
            errors.push({
                productId: item.productId,
                message: `Доступно только ${availableStock} шт. товара "${item.name}"`,
            });
        }
    });
    return errors;
};
/**
 * Проверяет минимальную сумму заказа (например, для бесплатной доставки)
 */
export const isMinimumOrderAmountMet = (total, minimum) => {
    return total >= minimum;
};
