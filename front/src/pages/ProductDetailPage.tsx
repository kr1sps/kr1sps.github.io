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
  Upload,
} from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, TagOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProduct } from '../features/products/hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/api-client';
import { formatPrice } from '../utils/formatters';

const { Title, Paragraph, Text } = Typography;

interface UploadOptions {
  file: File | Blob;
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id || '');

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error || !product) return <Alert message="Товар не найден" type="error" showIcon />;

  const isOutOfStock = product.stock <= 0;
  const currentCartItem = cartItems.find(item => item.productId === product.id);
  const inCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const availableToAdd = product.stock - inCartQuantity;
  const isLimitReached = availableToAdd <= 0;

  const handleAddToCart = async () => {
    if (isLimitReached) return;
    try {
      await addItem({ productId: product.id, quantity });
      message.success(`${quantity} шт. добавлено в корзину`);
      setQuantity(1);
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || 'Не удалось добавить товар');
    }
  };

  const handleImageUpload = async (options: unknown) => {
    const { file, onSuccess, onError } = options as UploadOptions;

    const hideLoading = message.loading('Загрузка картинки в облако...', 0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await apiClient.post<{ url: string }>('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newImageUrl = uploadRes.data.url;

      await apiClient.patch(`/products/${product!.id}`, {
        imageUrls: [newImageUrl],
      });

      hideLoading();
      message.success('Фотография товара успешно обновлена!');

      if (onSuccess) onSuccess(newImageUrl);

      window.location.reload();
    } catch (error: unknown) {
      hideLoading();

      const err = error as { response?: { data?: { message?: string } } };

      if (onError) onError(new Error('Upload failed'));

      message.error(err.response?.data?.message || 'Ошибка загрузки картинки');
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

      <Card style={{ borderRadius: 24, overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
        <Row>
          <Col xs={24} md={12} style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
          }}>
            <Image
              src={product.imageUrls[0] || 'https://i.postimg.cc/9XD701DH/izobrazenie.png'}
              alt={product.name}
              style={{ maxHeight: '400px', objectFit: 'contain', borderRadius: 16 }}
            />

            {isAdmin && (
              <div style={{ marginTop: 24 }}>
                <Upload
                  customRequest={(options) => handleImageUpload(options)}
                  showUploadList={false}
                  accept="image/png, image/jpeg, image/jpg"
                >
                  <Button icon={<UploadOutlined />} type="dashed" size="large">
                    Изменить фото (Admin)
                  </Button>
                </Upload>
              </div>
            )}
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
                ) : isLimitReached ? (
                  <Tag color="orange" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    Вы добавили всё доступное количество в корзину
                  </Tag>
                ) : (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      Доступно для заказа: {availableToAdd} шт. (из {product.stock})
                    </Tag>

                    <Space size="middle">
                      <InputNumber
                        size="large"
                        min={1}
                        max={availableToAdd}
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