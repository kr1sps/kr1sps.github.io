import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Row, Col, message, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { authService } from '../features/auth/services/authService';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, login, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, ...profileData } = values;

      const updatedUser = await authService.updateProfile(profileData);

      if (token) login(updatedUser, token);
      message.success('Профиль успешно обновлен');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ошибка при обновлении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="hero-gradient" style={{ marginBottom: 32, textAlign: 'left', padding: '2rem' }}>
        <Title level={1} style={{ margin: 0 }}>Личный кабинет</Title>
        <Paragraph style={{ fontSize: 16, marginTop: 8 }}>
          Управляйте своими данными для быстрого оформления заказов
        </Paragraph>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card className="glass-card" styles={{ body: { padding: 32 } }}>
            <Form
              layout="vertical"
              initialValues={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                address: user?.address,
              }}
              onFinish={onFinish}
              size="large"
            >
              <Title level={4} style={{ marginBottom: 24 }}>Персональные данные</Title>

              <Form.Item label={<Text strong>Имя и фамилия</Text>} name="name"
                         rules={[{ required: true, message: 'Введите имя' }]}>
                <Input prefix={<UserOutlined style={{ color: 'var(--accent)' }} />} placeholder="Иван Иванов" />
              </Form.Item>

              <Form.Item label={<Text strong>Email (не редактируется)</Text>} name="email">
                <Input disabled prefix={<UserOutlined style={{ opacity: 0.5 }} />} />
              </Form.Item>

              <Divider style={{ margin: '32px 0' }} />

              <Title level={4} style={{ marginBottom: 24 }}>Контактная информация</Title>

              <Form.Item label={<Text strong>Номер телефона</Text>} name="phone">
                <Input prefix={<PhoneOutlined style={{ color: 'var(--accent)' }} />} placeholder="+7 (900) 000-00-00" />
              </Form.Item>

              <Form.Item label={<Text strong>Адрес доставки</Text>} name="address">
                <Input.TextArea
                  placeholder="Город, улица, дом, квартира"
                  autoSize={{ minRows: 3 }}
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 40, marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  block
                  style={{ height: 50, borderRadius: 40 }}
                >
                  Сохранить изменения
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="glass-card" style={{ textAlign: 'center', height: '100%' }}>
            <Space direction="vertical" align="center" size="large">
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'var(--accent-bg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid var(--accent)',
              }}>
                <UserOutlined style={{ fontSize: 48, color: 'var(--accent)' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>{user?.name}</Title>
                <Text type="secondary">{user?.role === 'admin' ? 'Администратор' : 'Покупатель'}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                На сайте с {new Date(user?.createdAt || '').toLocaleDateString()} [cite: 390]
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;