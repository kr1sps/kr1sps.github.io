import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, InputNumber, Spin, Alert, Typography, Image, Space, Tag } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProduct } from '../features/products/hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../features/cart/logic/cartCalculations';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id || '');
  const addItem = useCartStore(state => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error || !product) return <Alert message="Товар не найден" type="error" showIcon />;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      maxQuantity: product.stock,
      imageUrl: product.imageUrls[0],
      quantity,
    });
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Назад
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Image
            src={product.imageUrls[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={<Title level={2}>{product.name}</Title>}
            extra={<Tag color="blue">SKU: {product.sku}</Tag>}
          >
            <Paragraph>{product.description}</Paragraph>
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
              <Text strong style={{ fontSize: 24 }}>
                {formatPrice(product.price)}
              </Text>
              {isOutOfStock ? (
                <Tag color="red">Нет в наличии</Tag>
              ) : (
                <Tag color="green">В наличии: {product.stock} шт.</Tag>
              )}
              {!isOutOfStock && (
                <Space>
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={value => setQuantity(value || 1)}
                  />
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                  >
                    Добавить в корзину
                  </Button>
                </Space>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;