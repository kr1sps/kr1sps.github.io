import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Typography,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import { EditOutlined, ReloadOutlined, CiOutlined } from '@ant-design/icons';
import { apiClient } from '../lib/api-client';
import { formatPrice } from '../utils/formatters';
import type { Product, Category } from '../shared/types';
import type { TableProps } from 'antd';
import type { Key } from 'antd/es/table/interface';

const { Title } = Typography;
const { Option } = Select;

export const AdminProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products?showArchived=true');
      setProducts(res.data.data || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      message.error('Не удалось загрузить список товаров');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      stock: record.stock,
      categoryId: record.categoryId,
      sku: record.sku,
      isActive: record.isActive,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingProduct) return;

    const payload = {
      ...values,
      price: values.price !== undefined ? Number(values.price) : undefined,
      stock: values.stock !== undefined ? Number(values.stock) : undefined,
    };

    try {
      await apiClient.patch(`/products/${editingProduct.id}`, payload);
      message.success('Товар успешно обновлён');
      setIsModalOpen(false);
      form.resetFields();
      await fetchProducts();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Ошибка при обновлении товара',
      );
    }
  };

  const toggleArchiveStatus = async (id: string, currentStatus: boolean) => {
    const hide = message.loading('Обновление статуса...', 0);
    try {
      await apiClient.patch(`/products/${id}`, { isActive: !currentStatus });
      hide();
      message.success(currentStatus ? 'Товар перенесён в архив' : 'Товар восстановлен из архива');
      await fetchProducts();
    } catch (error) {
      hide();
      message.error('Ошибка при обновлении статуса');
    }
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Фото',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (urls: string[]) => (
        <img
          src={urls?.[0] || 'https://via.placeholder.com/50'}
          alt="preview"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Остаток',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>{stock} шт.</Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'blue' : 'default'}>
          {isActive ? 'Активен' : 'В архиве'}
        </Tag>
      ),
      filters: [
        { text: 'Активные', value: true },
        { text: 'В архиве', value: false },
      ],
      onFilter: (value: boolean | Key, record: Product) =>
        record.isActive === Boolean(value),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Изменить
          </Button>

          <Popconfirm
            title={record.isActive ? 'Архивировать товар?' : 'Вернуть товар в продажу?'}
            description={
              record.isActive
                ? 'Он исчезнет из каталога для покупателей.'
                : 'Он снова появится в каталоге.'
            }
            onConfirm={() => toggleArchiveStatus(record.id, record.isActive)}
            okText="Да"
            cancelText="Отмена"
          >
            <Button
              danger={record.isActive}
              icon={record.isActive ? <CiOutlined /> : <ReloadOutlined />}
            >
              {record.isActive ? 'В архив' : 'Восстановить'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 16 }}>
      <Title style={{ color: 'var(--accent)' }} level={2}>
        Управление товарами
      </Title>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Редактирование товара"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Сохранить изменения"
        cancelText="Отмена"
        width={700}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
          layout="vertical"
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Название товара"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Например: MacBook Air 13" />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={4} placeholder="Подробное описание товара" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="price"
              label="Цена (₽)"
              rules={[{ required: true, message: 'Укажите цену' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Остаток на складе"
              rules={[{ required: true, message: 'Укажите количество' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select placeholder="Выберите категорию">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sku" label="Артикул (SKU)">
            <Input placeholder="ACER-ASP5-001" />
          </Form.Item>

          <Form.Item name="isActive" label="Товар активен" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};