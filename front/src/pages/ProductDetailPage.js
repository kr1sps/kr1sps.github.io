import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, InputNumber, Spin, Alert, Typography, Image, Space, Tag } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProduct } from '../features/products/hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../features/cart/logic/cartCalculations';
const { Title, Paragraph, Text } = Typography;
const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id || '');
    const addItem = useCartStore(state => state.addItem);
    const [quantity, setQuantity] = useState(1);
    if (isLoading)
        return _jsx(Spin, { size: "large", style: { display: 'block', margin: '100px auto' } });
    if (error || !product)
        return _jsx(Alert, { message: "\u0422\u043E\u0432\u0430\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", type: "error", showIcon: true });
    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            maxQuantity: product.stock,
            imageUrl: product.imageUrls[0],
            quantity,
        });
    };
    const isOutOfStock = product.stock <= 0;
    return (_jsxs("div", { children: [_jsx(Button, { type: "link", icon: _jsx(ArrowLeftOutlined, {}), onClick: () => navigate(-1), style: { marginBottom: 16 }, children: "\u041D\u0430\u0437\u0430\u0434" }), _jsxs(Row, { gutter: [32, 32], children: [_jsx(Col, { xs: 24, md: 12, children: _jsx(Image.PreviewGroup, { src: product.imageUrls[0] || 'https://via.placeholder.com/500', alt: product.name, style: { width: '100%', objectFit: 'cover' } }) }), _jsx(Col, { xs: 24, md: 12, children: _jsxs(Card.Meta, { children: [_jsx(Title, { level: 2, children: product.name }), _jsxs(Tag, { color: "blue", children: ["SKU: ", product.sku] }), _jsx(Paragraph, { style: { marginTop: 16 }, children: product.description }), _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%', marginTop: 24 }, children: [_jsx(Text, { strong: true, style: { fontSize: 24 }, children: formatPrice(product.price) }), isOutOfStock ? (_jsx(Tag, { color: "red", children: "\u041D\u0435\u0442 \u0432 \u043D\u0430\u043B\u0438\u0447\u0438\u0438" })) : (_jsxs(Tag, { color: "green", children: ["\u0412 \u043D\u0430\u043B\u0438\u0447\u0438\u0438: ", product.stock, " \u0448\u0442."] })), !isOutOfStock && (_jsxs(Space, { children: [_jsx(InputNumber, { min: 1, max: product.stock, value: quantity, onChange: (value) => setQuantity(value || 1) }), _jsx(Button, { type: "primary", icon: _jsx(ShoppingCartOutlined, {}), onClick: handleAddToCart, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443" })] }))] })] }) })] })] }));
};
export default ProductDetailPage;
