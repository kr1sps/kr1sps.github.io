import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const menuItems = [
        {
            key: '/products',
            icon: _jsx(HomeOutlined, {}),
            label: _jsx(Link, { to: "/products", children: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" }),
        },
        {
            key: '/cart',
            icon: _jsx(ShoppingCartOutlined, {}),
            label: _jsx(Link, { to: "/cart", children: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430" }),
        },
    ];
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs(Layout, { children: [_jsxs(Header, { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("div", { className: "logo", style: { color: 'white', marginRight: '20px', fontSize: '20px' }, children: "TechStore" }), _jsx(Menu, { theme: "dark", mode: "horizontal", selectedKeys: [location.pathname], items: menuItems, style: { flex: 1, minWidth: 0 } })] }), _jsx(Space, { children: user ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: { color: 'white' }, children: user.name }), _jsx(Button, { type: "text", icon: _jsx(LogoutOutlined, {}), onClick: handleLogout, style: { color: 'white' }, children: "\u0412\u044B\u0439\u0442\u0438" })] })) : (_jsx(Button, { type: "link", icon: _jsx(UserOutlined, {}), onClick: () => navigate('/login'), style: { color: 'white' }, children: "\u0412\u043E\u0439\u0442\u0438" })) })] }), _jsx(Content, { style: { padding: '24px 50px' }, children: _jsx(Outlet, {}) }), _jsxs(Footer, { style: { textAlign: 'center' }, children: ["\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B \u043F\u043E \u0432\u0435\u0431-\u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u00A9", new Date().getFullYear()] })] }));
};
export default MainLayout;
