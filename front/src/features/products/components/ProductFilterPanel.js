import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Input, Select, Slider, Switch, Space, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SortOption } from '../logic/productFilters';
import { useCategories } from '../hooks/useProducts';
const { Option } = Select;
const ProductFilterPanel = ({ filter, sort, onFilterChange, onSortChange, onReset, }) => {
    const { data: categories } = useCategories();
    const handleSearchChange = (value) => {
        onFilterChange({ ...filter, search: value || undefined });
    };
    const handleCategoryChange = (value) => {
        onFilterChange({ ...filter, categoryId: value || undefined });
    };
    const handleInStockChange = (checked) => {
        onFilterChange({ ...filter, inStock: checked || undefined });
    };
    const handlePriceRangeChange = (values) => {
        onFilterChange({
            ...filter,
            minPrice: values[0],
            maxPrice: values[1],
        });
    };
    const handleSortChange = (value) => {
        onSortChange(value);
    };
    return (_jsx(Card, { title: "\u0424\u0438\u043B\u044C\u0442\u0440\u044B \u0438 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430", style: { marginBottom: 24 }, children: _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { xs: 24, md: 8, children: _jsx(Input, { placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u0438\u043B\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044E", prefix: _jsx(SearchOutlined, {}), value: filter.search || '', onChange: (e) => handleSearchChange(e.target.value), allowClear: true }) }), _jsx(Col, { xs: 24, md: 8, children: _jsx(Select, { placeholder: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F", style: { width: '100%' }, value: filter.categoryId || undefined, onChange: handleCategoryChange, allowClear: true, children: categories?.map(cat => (_jsx(Option, { value: cat.id, children: cat.name }, cat.id))) }) }), _jsx(Col, { xs: 24, md: 8, children: _jsxs(Space, { children: [_jsx(Switch, { checked: filter.inStock || false, onChange: handleInStockChange }), _jsx("span", { children: "\u0422\u043E\u043B\u044C\u043A\u043E \u0432 \u043D\u0430\u043B\u0438\u0447\u0438\u0438" })] }) }), _jsxs(Col, { xs: 24, md: 12, children: [_jsx("div", { children: "\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D \u0446\u0435\u043D (\u20BD):" }), _jsx(Slider, { range: true, min: 0, max: 200000, step: 1000, value: [filter.minPrice || 0, filter.maxPrice || 200000], onChange: handlePriceRangeChange, tooltip: { formatter: (value) => `${value} ₽` } })] }), _jsx(Col, { xs: 24, md: 6, children: _jsxs(Select, { placeholder: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430", style: { width: '100%' }, value: sort, onChange: handleSortChange, children: [_jsx(Option, { value: SortOption.NEWEST, children: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u043E\u0432\u044B\u0435" }), _jsx(Option, { value: SortOption.PRICE_ASC, children: "\u0426\u0435\u043D\u0430: \u043F\u043E \u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u044E" }), _jsx(Option, { value: SortOption.PRICE_DESC, children: "\u0426\u0435\u043D\u0430: \u043F\u043E \u0443\u0431\u044B\u0432\u0430\u043D\u0438\u044E" }), _jsx(Option, { value: SortOption.NAME_ASC, children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435: \u0410-\u042F" }), _jsx(Option, { value: SortOption.NAME_DESC, children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435: \u042F-\u0410" })] }) }), _jsx(Col, { xs: 24, md: 6, children: _jsx(Button, { onClick: onReset, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }) })] }) }));
};
export default ProductFilterPanel;
