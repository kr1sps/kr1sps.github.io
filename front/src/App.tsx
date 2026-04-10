import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { PrivateRoute } from './routes/PrivateRoute';
import ProfilePage from './pages/ProfilePage.tsx';
import { AdminProductListPage } from './pages/AdminProductListPage';
import { useAuthStore } from './store/authStore';

const AdminRoute = () => {
  const { user } = useAuthStore();

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="product-list-admins" element={<AdminProductListPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;