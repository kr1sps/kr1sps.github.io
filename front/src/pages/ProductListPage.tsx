import { useState } from 'react';
import { Row, Col, Pagination, Spin, Alert, Empty, Typography } from 'antd';
import { useProducts } from '../features/products/hooks/useProducts';
import ProductCard from '../features/products/components/ProductCard';
import ProductFilterPanel from '../features/products/components/ProductFilterPanel';
import type { ProductFilter } from '../shared/types';
import { SortOption } from '../features/products/logic/productFilters';

const { Title, Paragraph } = Typography;
const DEFAULT_PAGE_SIZE = 12;

const ProductListPage = () => {
  const [filter, setFilter] = useState<ProductFilter>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [sort, setSort] = useState<SortOption>(SortOption.NEWEST);
  const { data, isLoading, error, isFetching } = useProducts(filter, sort);

  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilter,
      page: 1,
    }));
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setFilter((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleReset = () => {
    setFilter({ page: 1, limit: DEFAULT_PAGE_SIZE });
    setSort(SortOption.NEWEST);
  };

  if (error) {
    return <Alert message="Ошибка загрузки товаров" type="error" showIcon />;
  }

  return (
    <div>
      <div className="hero-gradient" style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: 8 }}>
          Добро пожаловать в TechStore
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          Гаджеты, которые меняют жизнь. Эксклюзивные модели по лучшим ценам.
        </Paragraph>
      </div>

      <ProductFilterPanel
        filter={filter}
        sort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      <Spin spinning={isLoading || isFetching} description="Загрузка товаров...">
        {data?.data.length === 0 ? (
          <Empty description="Товары не найдены" style={{ margin: '40px 0' }} />
        ) : (
          <>
            <Row gutter={[24, 32]} style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data?.data.map((product) => (
                <Col
                  key={product.id}
                  xs={24} sm={12} md={8} lg={6}
                  style={{ display: 'flex' }}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {data && data.totalPages > 1 && (
              <div style={{ marginTop: 48, textAlign: 'center' }}>
                <Pagination
                  current={data.page}
                  pageSize={data.limit}
                  total={data.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['12', '24', '48']}
                  showTotal={(total) => `Всего ${total} товаров`}
                />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
};

export default ProductListPage;