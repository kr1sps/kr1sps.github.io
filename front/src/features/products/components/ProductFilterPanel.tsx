import { Card, Input, Select, Slider, Switch, Space, Button, Row, Col, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ProductFilter } from '../../../shared/types';
import { SortOption } from '../logic/productFilters';
import { useCategories } from '../hooks/useProducts';

const { Option } = Select;

interface ProductFilterPanelProps {
    filter: ProductFilter;
    sort: SortOption;
    onFilterChange: (filter: ProductFilter) => void;
    onSortChange: (sort: SortOption) => void;
    onReset: () => void;
}

const ProductFilterPanel = ({
                                filter,
                                sort,
                                onFilterChange,
                                onSortChange,
                                onReset,
                            }: ProductFilterPanelProps) => {
    const { data: categories } = useCategories();

    const handleSearchChange = (value: string) => {
        onFilterChange({ ...filter, search: value || undefined });
    };

    const handleCategoryChange = (value: string) => {
        onFilterChange({ ...filter, categoryId: value || undefined });
    };

    const handleInStockChange = (checked: boolean) => {
        onFilterChange({ ...filter, inStock: checked || undefined });
    };

    const handlePriceRangeChange = (values: number[]) => {
        onFilterChange({
            ...filter,
            minPrice: values[0],
            maxPrice: values[1],
        });
    };

    const handleSortChange = (value: SortOption) => {
        onSortChange(value);
    };

    return (
      <Card
        style={{
            marginBottom: 32,
            borderRadius: 28,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
        }}
        styles={{ body: { padding: '24px' } }}
      >
          <Space align="center" style={{ marginBottom: 20 }}>
              <FilterOutlined style={{ fontSize: 20, color: 'var(--accent-light)' }} />
              <span style={{ fontWeight: 600, fontSize: 18, color: 'var(--accent-light)' }}>Фильтры и сортировка</span>
          </Space>
          <Divider style={{ margin: '12px 0 20px' }} />
          <Row gutter={[24, 20]}>
              <Col xs={24} md={8}>
                  <Input
                    placeholder="Поиск по названию или описанию"
                    prefix={<SearchOutlined />}
                    value={filter.search || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    allowClear
                    size="large"
                    style={{ borderRadius: 40 }}
                  />
              </Col>
              <Col xs={24} md={6}>
                  <Select
                    placeholder="Категория"
                    style={{ width: '100%', borderRadius: 40 }}
                    size="large"
                    value={filter.categoryId || undefined}
                    onChange={handleCategoryChange}
                    allowClear
                  >
                      {categories?.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                            {cat.name}
                        </Option>
                      ))}
                  </Select>
              </Col>
              <Col xs={24} md={5}>
                  <Space align="center">
                      <Switch
                        checked={filter.inStock || false}
                        onChange={handleInStockChange}
                        style={{ backgroundColor: filter.inStock ? '#aa3bff' : undefined }}
                      />
                      <span style={{ color: 'var(--accent-light)' }}>Только в наличии</span>
                  </Space>
              </Col>
              <Col xs={24} md={12}>
                  <div style={{ marginBottom: 8, fontWeight: 500, color: 'var(--accent-light)' }}>Диапазон цен (₽):</div>
                  <Slider
                    range
                    min={0}
                    max={200000}
                    step={1000}
                    value={[filter.minPrice || 0, filter.maxPrice || 200000]}
                    onChange={handlePriceRangeChange}
                    tooltip={{ formatter: (value?: number) => `${value} ₽` }}
                    trackStyle={[{ backgroundColor: '#aa3bff' }, { backgroundColor: '#aa3bff' }]}
                    handleStyle={[{ borderColor: '#aa3bff' }, { borderColor: '#aa3bff' }]}
                  />
              </Col>
              <Col xs={24} md={6}>
                  <Select
                    placeholder="Сортировка"
                    style={{ width: '100%', borderRadius: 40 }}
                    size="large"
                    value={sort}
                    onChange={handleSortChange}
                  >
                      <Option value={SortOption.NEWEST}>✨ Сначала новые</Option>
                      <Option value={SortOption.PRICE_ASC}>💰 Цена: по возрастанию</Option>
                      <Option value={SortOption.PRICE_DESC}>💰 Цена: по убыванию</Option>
                      <Option value={SortOption.NAME_ASC}>🔤 Название: А-Я</Option>
                      <Option value={SortOption.NAME_DESC}>🔤 Название: Я-А</Option>
                  </Select>
              </Col>
              <Col xs={24} md={4}>
                  <Button icon={<ReloadOutlined />} onClick={onReset} size="large" block>
                      Сбросить
                  </Button>
              </Col>
          </Row>
      </Card>
    );
};

export default ProductFilterPanel;