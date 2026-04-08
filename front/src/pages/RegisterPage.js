import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/services/authService';
import { useAuthStore } from '../store/authStore';
const { Title } = Typography;
const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(values);
            login(response.user, response.accessToken);
            message.success('Регистрация успешна');
            navigate('/products');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: { maxWidth: 500, margin: '50px auto' }, children: _jsxs(Card, { children: [_jsx(Title, { level: 3, style: { textAlign: 'center' }, children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }), error && _jsx(Alert, { message: error, type: "error", showIcon: true, style: { marginBottom: 16 } }), _jsxs(Form, { name: "register", onFinish: onFinish, size: "large", children: [_jsx(Form.Item, { name: "name", rules: [{ required: true, message: 'Введите имя' }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u0418\u043C\u044F" }) }), _jsx(Form.Item, { name: "email", rules: [{ required: true, message: 'Введите email', type: 'email' }], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "Email" }) }), _jsx(Form.Item, { name: "password", rules: [{ required: true, message: 'Введите пароль', min: 6 }], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C (\u043C\u0438\u043D. 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)" }) }), _jsx(Form.Item, { name: "phone", rules: [{ required: false }], children: _jsx(Input, { prefix: _jsx(PhoneOutlined, {}), placeholder: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }) }), _jsx(Form.Item, { name: "address", rules: [{ required: false }], children: _jsx(Input, { prefix: _jsx(HomeOutlined, {}), placeholder: "\u0410\u0434\u0440\u0435\u0441 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, block: true, children: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F" }) }), _jsxs("div", { style: { textAlign: 'center' }, children: ["\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? ", _jsx(Link, { to: "/login", children: "\u0412\u043E\u0439\u0442\u0438" })] })] })] }) }));
};
export default RegisterPage;
