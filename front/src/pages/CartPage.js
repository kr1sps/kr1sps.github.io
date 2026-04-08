import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, Button, InputNumber, Space, Typography, Card, Empty, Popconfirm } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../features/cart/logic/cartCalculations';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const CartPage = () => {
    const navigate = useNavigate();
    const { items, totalQuantity, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();
    const handleQuantityChange = (productId, value) => {
        if (value) {
            updateQuantity(productId, value);
        }
    };
    const columns = [
        {
            title: 'Товар',
            dataIndex: 'name',
            key: 'name',
            render: (_, item) => (_jsxs(Space, { children: [_jsx("img", { src: item.imageUrl || 'https://via.placeholder.com/50', alt: item.name, style: { width: 50, height: 50, objectFit: 'cover' } }), _jsx("span", { children: item.name })] })),
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, item) => (_jsx(InputNumber, { min: 1, max: item.maxQuantity, value: quantity, onChange: (value) => handleQuantityChange(item.productId, value) })),
        },
        {
            title: 'Сумма',
            key: 'total',
            render: (_, item) => formatPrice(item.price * item.quantity),
        },
        {
            title: '',
            key: 'action',
            render: (_, item) => (_jsx(Popconfirm, { title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440 \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B?", onConfirm: () => removeItem(item.productId), okText: "\u0414\u0430", cancelText: "\u041D\u0435\u0442", children: _jsx(Button, { type: "text", danger: true, icon: _jsx(DeleteOutlined, {}) }) })),
        },
    ];
    if (items.length === 0) {
        return (_jsx(Empty, { description: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430", children: _jsx(Button, { type: "primary", onClick: () => navigate('/products'), children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043F\u043E\u043A\u0443\u043F\u043A\u0430\u043C" }) }));
    }
    return (_jsxs("div", { children: [_jsx(Title, { level: 2, children: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430" }), _jsx(Table, { columns: columns, dataSource: items, rowKey: "productId", pagination: false, scroll: { x: 800 }, footer: () => (_jsx("div", { style: { textAlign: 'right' }, children: _jsxs(Space, { direction: "vertical", style: { alignItems: 'flex-end' }, children: [_jsxs(Text, { children: ["\u0412\u0441\u0435\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u043E\u0432: ", totalQuantity] }), _jsxs(Text, { strong: true, style: { fontSize: 18 }, children: ["\u0418\u0442\u043E\u0433\u043E: ", formatPrice(totalPrice)] })] }) })) }), _jsx(Card, { style: { marginTop: 24 }, children: _jsxs(Space, { style: { justifyContent: 'space-between', width: '100%' }, children: [_jsx(Button, { onClick: clearCart, children: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443" }), _jsxs(Space, { children: [_jsx(Button, { onClick: () => navigate('/products'), children: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u043E\u043A\u0443\u043F\u043A\u0438" }), _jsx(Button, { type: "primary", icon: _jsx(ShoppingOutlined, {}), onClick: () => navigate('/checkout'), children: "\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437" })] })] }) })] }));
};
export default CartPage;
