import { Card, Button, Typography, Space, Tag, Badge, message } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../shared/types';
import { formatPrice } from '../../../utils/formatters';
import { useCartStore } from '../../../store/cartStore';
import React from 'react';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;

  const currentCartItem = cartItems.find(item => item.productId === product.id);
  const inCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const isLimitReached = inCartQuantity >= product.stock;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock || isLimitReached) return;

    try {
      await addItem({
        productId: product.id,
        quantity: 1,
      });
      message.success(`${product.name} добавлен в корзину`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Не удалось добавить товар');
      }
    }
  };

  return (
    <Badge.Ribbon
      text={product.stock > 0 && product.stock < 5 ? 'Осталось мало' : ''}
      color="orange"
      style={{ display: product.stock > 0 && product.stock < 5 ? 'block' : 'none', zIndex: 2 }}
    >
      <Card
        hoverable
        cover={
          <div style={{
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            borderRadius: '24px 24px 0 0',
            padding: '20px',
            overflow: 'hidden',
          }}>
            <img
              alt={product.name}
              src={product.imageUrls[0] || 'https://via.placeholder.com/300?text=Нет+фото'}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        }
        actions={[
          <Button
            key="details"
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Подробнее
          </Button>,
          <Button
            key="addToCart"
            type="text"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLimitReached}
          >
            {isLimitReached ? 'Максимум' : 'В корзину'}
          </Button>,
        ]}
        style={{
          borderRadius: 24,
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px' } }}
      >
        <div style={{ flex: 1 }}>
          <Meta
            title={
              <Text strong ellipsis={{ tooltip: product.name }} style={{ fontSize: '1.1rem' }}>
                {product.name}
              </Text>
            }
            description={
              <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginTop: 8, marginBottom: 16 }}>
                {product.description}
              </Paragraph>
            }
          />
        </div>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong style={{ fontSize: '1.4rem', color: 'var(--accent)' }}>
            {formatPrice(product.price)}
          </Text>
          {isOutOfStock ? (
            <Tag color="red" variant="filled">
              Нет в наличии
            </Tag>
          ) : (
            <Tag color="green" variant="filled">
              В наличии: {product.stock} шт.
            </Tag>
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;