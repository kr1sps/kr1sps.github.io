import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/services/authService';
import { useAuthStore } from '../store/authStore';

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(values);
      login(response.user, response.accessToken);
      message.success('Регистрация успешна');
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>Регистрация</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item name="name" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input prefix={<UserOutlined />} placeholder="Имя" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Введите email', type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль', min: 6 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль (мин. 6 символов)" />
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: false }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Телефон (необязательно)" />
          </Form.Item>
          <Form.Item name="address" rules={[{ required: false }]}>
            <Input prefix={<HomeOutlined />} placeholder="Адрес (необязательно)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Зарегистрироваться
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;