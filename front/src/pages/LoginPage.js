import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../features/auth/services/authService';
const { Title } = Typography;
const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(values);
            login(response.user, response.accessToken);
            message.success('Вход выполнен успешно');
            navigate('/products');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: { maxWidth: 400, margin: '100px auto' }, children: _jsxs(Card, { children: [_jsx(Title, { level: 3, style: { textAlign: 'center' }, children: "\u0412\u0445\u043E\u0434" }), error && _jsx(Alert, { message: error, type: "error", showIcon: true, style: { marginBottom: 16 } }), _jsxs(Form, { name: "login", onFinish: onFinish, size: "large", children: [_jsx(Form.Item, { name: "email", rules: [{ required: true, message: 'Введите email' }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "Email" }) }), _jsx(Form.Item, { name: "password", rules: [{ required: true, message: 'Введите пароль' }], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, block: true, children: "\u0412\u043E\u0439\u0442\u0438" }) }), _jsxs("div", { style: { textAlign: 'center' }, children: ["\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? ", _jsx(Link, { to: "/register", children: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F" })] })] })] }) }));
};
export default LoginPage;
