import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Pagination, Spin, Alert, Empty } from 'antd';
import { useProducts } from '../features/products/hooks/useProducts';
import ProductCard from '../features/products/components/ProductCard';
import ProductFilterPanel from '../features/products/components/ProductFilterPanel';
import { SortOption } from '../features/products/logic/productFilters';
const DEFAULT_PAGE_SIZE = 12;
const ProductListPage = () => {
    const [filter, setFilter] = useState({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
    });
    const [sort, setSort] = useState(SortOption.NEWEST);
    const { data, isLoading, error, isFetching } = useProducts(filter, sort);
    console.log('data:', data, 'isLoading:', isLoading, 'error:', error);
    const handleFilterChange = (newFilter) => {
        setFilter(prev => ({
            ...prev,
            ...newFilter,
            page: 1, // сбрасываем страницу при изменении фильтров
        }));
    };
    const handleSortChange = (newSort) => {
        setSort(newSort);
        setFilter(prev => ({ ...prev, page: 1 }));
    };
    const handlePageChange = (page, pageSize) => {
        setFilter(prev => ({ ...prev, page, limit: pageSize }));
    };
    const handleReset = () => {
        setFilter({ page: 1, limit: DEFAULT_PAGE_SIZE });
        setSort(SortOption.NEWEST);
    };
    if (error) {
        return _jsx(Alert, { message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0442\u043E\u0432\u0430\u0440\u043E\u0432", type: "error", showIcon: true });
    }
    return (_jsxs("div", { children: [_jsx(ProductFilterPanel, { filter: filter, sort: sort, onFilterChange: handleFilterChange, onSortChange: handleSortChange, onReset: handleReset }), _jsx(Spin, { spinning: isLoading || isFetching, children: data?.data.length === 0 ? (_jsx(Empty, { description: "\u0422\u043E\u0432\u0430\u0440\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B" })) : (_jsxs(_Fragment, { children: [_jsx(Row, { gutter: [16, 16], children: data?.data.map(product => (_jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsx(ProductCard, { product: product }) }, product.id))) }), data && data.totalPages > 1 && (_jsx("div", { style: { marginTop: 24, textAlign: 'center' }, children: _jsx(Pagination, { current: data.page, pageSize: data.limit, total: data.total, onChange: handlePageChange, showSizeChanger: true, pageSizeOptions: ['12', '24', '48'] }) }))] })) })] }));
};
export default ProductListPage;
