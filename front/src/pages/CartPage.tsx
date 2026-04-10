import { Table, Button, InputNumber, Space, Typography, Card, Empty, Popconfirm, Divider, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ClearOutlined } from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { CartItem } from '../shared/types';
import { useState } from 'react';

const { Title, Text } = Typography;

const QuantityInput = ({ item, onUpdate }: { item: CartItem; onUpdate: (productId: string, value: number) => void }) => {
  const [localValue, setLocalValue] = useState(item.quantity);

  const handleCommit = () => {
    if (localValue !== item.quantity && localValue > 0) {
      onUpdate(item.productId, localValue);
    }
  };

  return (
    <InputNumber
      min={1}
      max={item.maxQuantity}
      value={localValue}
      onChange={(value) => setLocalValue(value || 1)}
      onBlur={handleCommit}
      onPressEnter={handleCommit}
      size="middle"
      style={{ width: 90 }}
    />
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleQuantityChange = (productId: string, value: number | null) => {
    if (value) {
      try {
        updateQuantity(productId, value);
      } catch (error: any) {
        message.error(error.message || 'Ошибка изменения количества');
      }
    }
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Товар',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (_, item) => (
        <Space size={16}>
          <img
            src={item.imageUrl || 'https://via.placeholder.com/80?text=Нет+фото'}
            alt={item.name}
            style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 16, background: 'white' }}
          />
          <Text strong style={{ color: 'var(--text)' }}>{item.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      width: '15%',
      render: (price: number) => <Text style={{ color: 'var(--text)' }}>{formatPrice(price)}</Text>,
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: '20%',
      render: (quantity, item) => (
        <QuantityInput
          key={`${item.productId}-${quantity}`}
          item={item}
          onUpdate={handleQuantityChange}
        />
      ),
    },
    {
      title: 'Сумма',
      key: 'total',
      align: 'right',
      width: '15%',
      render: (_, item) => <Text strong
                                 style={{ color: 'var(--text)' }}>{formatPrice(item.price * item.quantity)}</Text>,
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (_, item) => (
        <Popconfirm
          title="Удалить товар из корзины?"
          onConfirm={() => removeItem(item.productId)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div className="fade-up" style={{ textAlign: 'center', marginTop: 80 }}>
        <Empty description={<span style={{ color: 'var(--text)' }}>Корзина пуста</span>}
               image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={() => navigate('/products')} shape="round" size="large">
            Перейти к покупкам
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <Title level={2} style={{ marginBottom: 24, color: 'var(--text-h)' }}>
        🛒 Корзина
      </Title>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="productId"
        pagination={false}
        scroll={{ x: 800 }}
        style={{ background: 'transparent' }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: 'var(--bg-secondary)',
                  fontWeight: 600,
                  color: '#ffffff',
                  borderBottom: '1px solid var(--border)',
                }}
              />
            ),
          },
        }}
      />
      <Divider />
      <Card style={{
        borderRadius: 28,
        marginTop: 24,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: '#ffffff' }}>Всего товаров:</Text>
            <Text style={{ color: '#ffffff' }} strong>{totalQuantity} шт.</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: '#ffffff', fontSize: 20 }}>Итого:</Text>
            <Text strong style={{ fontSize: 28, color: 'var(--accent)' }}>
              {formatPrice(totalPrice)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button icon={<ClearOutlined />} onClick={clearCart} size="large">
              Очистить корзину
            </Button>
            <Space>
              <Button onClick={() => navigate('/products')} size="large">
                Продолжить покупки
              </Button>
              <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/checkout')} size="large">
                Оформить заказ
              </Button>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CartPage;