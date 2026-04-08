import { Card, Button, Typography, Space, Tag, Badge } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../shared/types';
import { formatPrice } from '../../cart/logic/cartCalculations';
import { useCartStore } from '../../../store/cartStore';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (product.stock <= 0) return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            maxQuantity: product.stock,
            imageUrl: product.imageUrls[0],
            quantity: 1,
        });
    };

    const isOutOfStock = product.stock <= 0;

    return (
      <Badge.Ribbon
        text={product.stock > 0 && product.stock < 5 ? 'Осталось мало' : ''}
        color="orange"
        style={{ display: product.stock > 0 && product.stock < 5 ? 'block' : 'none' }}
      >
          <Card
            hoverable
            cover={
                <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img
                      alt={product.name}
                      src={product.imageUrls[0] || 'https://via.placeholder.com/300?text=No+Image'}
                      style={{
                          height: 220,
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
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
                  key="cart"
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{ color: isOutOfStock ? undefined : '#aa3bff' }}
                >
                    В корзину
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
            bodyStyle={{ flex: 1, padding: '20px 16px' }}
          >
              <Meta
                title={
                    <Text strong ellipsis style={{ fontSize: '1.1rem' }}>
                        {product.name}
                    </Text>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
                        <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 8 }}>
                            {product.description}
                        </Paragraph>
                        <Text strong style={{ fontSize: '1.4rem', color: 'var(--accent)' }}>
                            {formatPrice(product.price)}
                        </Text>
                        {isOutOfStock ? (
                          <Tag color="red" bordered={false}>
                              Нет в наличии
                          </Tag>
                        ) : (
                          <Tag color="green" bordered={false}>
                              В наличии: {product.stock} шт.
                          </Tag>
                        )}
                    </Space>
                }
              />
          </Card>
      </Badge.Ribbon>
    );
};

export default ProductCard;