import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Spin,
  Alert,
  Typography,
  Image,
  Space,
  Tag,
  Divider,
  message,
} from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, TagOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProduct } from '../features/products/hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../features/cart/logic/cartCalculations';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id || '');
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error || !product) return <Alert message="Товар не найден" type="error" showIcon />;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        maxQuantity: product.stock,
        imageUrl: product.imageUrls[0],
        quantity,
      });
      message.success(`${quantity} шт. добавлено в корзину`);
    } catch (error: any) {
      message.error(error.message || 'Не удалось добавить товар');
    }
  };

  return (
    <div className="fade-up">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, fontSize: '16px' }}
      >
        Вернуться в каталог
      </Button>

      <Card style={{ borderRadius: 24, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Row>
          <Col xs={24} md={12} style={{
            padding: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
          }}>
            <Image
              src={product.imageUrls[0] || 'https://via.placeholder.com/500?text=Нет+фото'}
              alt={product.name}
              style={{ maxHeight: '400px', objectFit: 'contain', borderRadius: 16 }}
            />
          </Col>

          <Col xs={24} md={12} style={{ padding: '40px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>

              <div>
                <Title level={2} style={{ margin: 0 }}>{product.name}</Title>
                <Space style={{ marginTop: 12 }}>
                  <Tag icon={<TagOutlined />} color="purple">{product.category?.name || 'Без категории'}</Tag>
                  <Text type="secondary">Артикул: {product.sku}</Text>
                </Space>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Title level={5}>Описание</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text)' }}>
                  {product.description}
                </Paragraph>
              </div>

              <div style={{ marginTop: 24, background: 'var(--bg-secondary)', padding: '24px', borderRadius: 16 }}>
                <Title level={2} style={{ color: 'var(--accent)', margin: '0 0 16px 0' }}>
                  {formatPrice(product.price)}
                </Title>

                {isOutOfStock ? (
                  <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px' }}>Нет в наличии</Tag>
                ) : (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      В наличии: {product.stock} шт.
                    </Tag>

                    <Space size="middle">
                      <InputNumber
                        size="large"
                        min={1}
                        max={product.stock}
                        value={quantity}
                        onChange={(value) => setQuantity(value || 1)}
                      />
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCart}
                        style={{ padding: '0 32px' }}
                      >
                        Добавить в корзину
                      </Button>
                    </Space>
                  </Space>
                )}
              </div>

            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;