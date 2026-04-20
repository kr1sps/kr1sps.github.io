import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Divider, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../features/orders/services/orderService';
import { formatPrice } from '../utils/formatters';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../features/products/hooks/useProducts';

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const { items, totalPrice, clearCart, isLoading: isCartLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!isCartLoading && items.length === 0 && !isProcessingOrder) {
      message.warning('Корзина пуста. Добавьте товары для оформления заказа.');
      navigate('/products');
    }
  }, [items, navigate, isCartLoading, isProcessingOrder]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        phone: user.phone || '',
        shippingAddress: user.address || '',
      });
    }
  }, [user, form]);

  interface CheckoutFormValues {
    shippingAddress: string;
    phone: string;
    comment?: string;
  }

  const onFinish = async (values: CheckoutFormValues) => {
    setIsProcessingOrder(true);
    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: values.shippingAddress,
        phone: values.phone,
        comment: values.comment,
      };

      await orderService.createOrder(payload);

      await clearCart();

      await queryClient.invalidateQueries({ queryKey: productKeys.all });

      message.success('Заказ успешно оформлен!');
      navigate('/profile');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Не удалось оформить заказ. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  if (isCartLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (items.length === 0) return null;

  return (
    <div className="fade-up" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Оформление заказа</Title>
      <Card className="glass-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Title level={4}>Контактные данные</Title>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ required: true, message: 'Введите номер телефона' }]}
          >
            <Input placeholder="+7 (900) 000-00-00" />
          </Form.Item>

          <Title level={4} style={{ marginTop: 24 }}>Доставка</Title>
          <Form.Item
            name="shippingAddress"
            label="Адрес доставки"
            rules={[{ required: true, message: 'Введите адрес доставки' }]}
          >
            <Input.TextArea rows={3} placeholder="Город, улица, дом, квартира" />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Комментарий к заказу (необязательно)"
          >
            <Input.TextArea rows={2} placeholder="Оставьте комментарий курьеру или сборщику" />
          </Form.Item>

          <Divider />

          <Space direction="vertical" style={{ width: '100%', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18 }}>
              К оплате: <Text strong style={{ fontSize: 24, color: 'var(--accent)' }}>{formatPrice(totalPrice)}</Text>
            </Text>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: 250, marginTop: 16 }}
            >
              Подтвердить заказ
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default CheckoutPage;