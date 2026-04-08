/**
 * Фильтрует массив товаров на клиенте согласно заданным критериям
 */
export const filterProducts = (products, filter) => {
    return products.filter(product => {
        // Фильтр по категории
        if (filter.categoryId && product.categoryId !== filter.categoryId) {
            return false;
        }
        // Фильтр по цене (минимальная)
        if (filter.minPrice !== undefined && product.price < filter.minPrice) {
            return false;
        }
        // Фильтр по цене (максимальная)
        if (filter.maxPrice !== undefined && product.price > filter.maxPrice) {
            return false;
        }
        // Фильтр "только в наличии"
        if (filter.inStock && product.stock <= 0) {
            return false;
        }
        // Поиск по названию или описанию
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            const nameMatch = product.name.toLowerCase().includes(searchLower);
            const descMatch = product.description.toLowerCase().includes(searchLower);
            if (!nameMatch && !descMatch) {
                return false;
            }
        }
        return true;
    });
};
// @ts-ignore
export var SortOption;
(function (SortOption) {
    SortOption["PRICE_ASC"] = "price_asc";
    SortOption["PRICE_DESC"] = "price_desc";
    SortOption["NAME_ASC"] = "name_asc";
    SortOption["NAME_DESC"] = "name_desc";
    SortOption["NEWEST"] = "newest";
})(SortOption || (SortOption = {}));
/**
 * Сортирует массив товаров
 */
export const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
        case SortOption.PRICE_ASC:
            return sorted.sort((a, b) => a.price - b.price);
        case SortOption.PRICE_DESC:
            return sorted.sort((a, b) => b.price - a.price);
        case SortOption.NAME_ASC:
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case SortOption.NAME_DESC:
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case SortOption.NEWEST:
            // Предполагаем, что более новые товары имеют больший timestamp в createdAt
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        default:
            return sorted;
    }
};
/**
 * Пагинация массива товаров (клиентская)
 */
export const paginateProducts = (products, page, limit) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = products.slice(start, end);
    return {
        data: paginatedData,
        total: products.length,
        page,
        limit,
        totalPages: Math.ceil(products.length / limit),
    };
};
