import { Table, Button, InputNumber, Space, Typography, Card, Empty, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ClearOutlined } from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../features/cart/logic/cartCalculations';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { CartItem } from '../shared/types';

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const { items, totalQuantity, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

    const handleQuantityChange = (productId: string, value: number | null) => {
        if (value) {
            updateQuantity(productId, value);
        }
    };

    const columns: ColumnsType<CartItem> = [
        {
            title: 'Товар',
            dataIndex: 'name',
            key: 'name',
            render: (_, item) => (
              <Space size={16}>
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 16 }}
                  />
                  <Text strong>{item.name}</Text>
              </Space>
            ),
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price: number) => <Text>{formatPrice(price)}</Text>,
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity: number, item) => (
              <InputNumber
                min={1}
                max={item.maxQuantity}
                value={quantity}
                onChange={(value) => handleQuantityChange(item.productId, value)}
                size="middle"
                style={{ width: 90 }}
              />
            ),
        },
        {
            title: 'Сумма',
            key: 'total',
            align: 'right',
            render: (_, item) => <Text strong>{formatPrice(item.price * item.quantity)}</Text>,
        },
        {
            title: '',
            key: 'action',
            align: 'center',
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
          <div style={{ textAlign: 'center', marginTop: 80 }}>
              <Empty description="Корзина пуста" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                  <Button type="primary" onClick={() => navigate('/products')} shape="round" size="large">
                      Перейти к покупкам
                  </Button>
              </Empty>
          </div>
        );
    }

    return (
      <div>
          <Title level={2} style={{ marginBottom: 24 }}>
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
                    cell: (props: any) => <th {...props} style={{ ...props.style, background: 'var(--bg-secondary)', fontWeight: 600 }} />,
                },
            }}
          />
          <Divider />
          <Card style={{ borderRadius: 28, marginTop: 24, background: 'var(--bg-secondary)' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Всего товаров:</Text>
                      <Text strong>{totalQuantity} шт.</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 20 }}>Итого:</Text>
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