import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography, Avatar, Dropdown } from 'antd';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import type { MenuProps } from 'antd';
import { useOrderEvents } from '../../hooks/useOrderEvents.ts';
import { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore.ts';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  useOrderEvents();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const menuItems: MenuProps['items'] = [
    {
      key: '/products',
      icon: <HomeOutlined />,
      label: <Link to="/products">Каталог</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart">Корзина</Link>,
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      key: '/product-list-admins',
      icon: <DashboardOutlined />,
      label: (
        <Link to="/product-list-admins" style={{ color: '#aa3bff', fontWeight: 'bold' }}>
          Админ Панель
        </Link>
      ),
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Профиль',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="app-layout" style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 15, 20, 0.75)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className="logo-text"
            style={{ cursor: 'pointer', marginRight: '40px' }}
            onClick={() => navigate('/products')}
          >
            🛍️ TechStore
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              borderBottom: 'none',
            }}
          />
        </div>
        <Space>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: '#aa3bff', verticalAlign: 'middle' }}
                  size="default"
                  icon={<UserOutlined />}
                />
                <Text style={{ color: 'white', fontWeight: 500 }}>{user.name}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => navigate('/login')}
              shape="round"
            >
              Войти
            </Button>
          )}
        </Space>
      </Header>
      <Content style={{ padding: '32px 24px', minHeight: '70vh' }}>
        <div className="fade-up">
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          borderTop: '1px solid var(--border)',
          marginTop: '2rem',
        }}
      >
        <Space direction="vertical" size="small">
          <Text type="secondary">Лабораторные работы по веб-разработке</Text>
          <Text type="secondary">© {new Date().getFullYear()} TechStore — инновационный маркетплейс</Text>
        </Space>
      </Footer>
    </Layout>
  );
};

export default MainLayout;