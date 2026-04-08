import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Button, Typography, Space, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../cart/logic/cartCalculations';
import { useCartStore } from '../../../store/cartStore';
const { Meta } = Card;
const { Text } = Typography;
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const addItem = useCartStore(state => state.addItem);
    console.log('Rendering ProductCard:', product.name);
    const handleAddToCart = () => {
        if (product.stock <= 0)
            return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            maxQuantity: product.stock,
            imageUrl: product.imageUrls[0],
            quantity: 1,
        });
    };
    const isOutOfStock = product.stock <= 0;
    return (_jsx(Card, { hoverable: true, cover: _jsx("img", { alt: product.name, src: product.imageUrls[0] || 'https://via.placeholder.com/300', style: { height: 200, objectFit: 'cover' } }), actions: [
            _jsx(Button, { type: "link", onClick: () => navigate(`/product/${product.id}`), children: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435" }),
            _jsx(Button, { type: "link", icon: _jsx(ShoppingCartOutlined, {}), onClick: handleAddToCart, disabled: isOutOfStock, children: "\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443" }),
        ], children: _jsx(Meta, { title: product.name, description: _jsxs(Space, { direction: "vertical", size: "small", children: [_jsx(Text, { strong: true, children: formatPrice(product.price) }), isOutOfStock ? (_jsx(Tag, { color: "red", children: "\u041D\u0435\u0442 \u0432 \u043D\u0430\u043B\u0438\u0447\u0438\u0438" })) : (_jsxs(Tag, { color: "green", children: ["\u0412 \u043D\u0430\u043B\u0438\u0447\u0438\u0438: ", product.stock, " \u0448\u0442."] }))] }) }) }));
};
export default ProductCard;
