import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Core Pages (eagerly loaded)
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy-loaded pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderFailedPage = lazy(() => import('./pages/OrderFailedPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));

import './App.css';

const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#0f172a', color: '#64748b',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '2.5rem', height: '2.5rem', border: '3px solid #334155',
        borderTop: '3px solid #3b82f6', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
      }} />
      Loading...
    </div>
  </div>
);

// Public layout (with Header + Footer)
const PublicLayout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

// Admin layout (no Header/Footer — dashboard has its own)
const AdminLayout = ({ children }) => (
  <div style={{ height: '100vh', overflow: 'hidden' }}>{children}</div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Admin Routes — fullscreen layout */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={
            <AdminLayout><AdminDashboard /></AdminLayout>
          } />
        </Route>

        {/* All other routes use PublicLayout */}
        <Route path="*" element={
          <PublicLayout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Info Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />

              {/* Policy Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />

              {/* Order Results */}
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/order-failed" element={<OrderFailedPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div style={{
                  minHeight: '70vh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: '#0f172a', color: '#94a3b8', gap: '1rem',
                }}>
                  <div style={{ fontSize: '5rem', fontWeight: 800, color: '#f1f5f9' }}>404</div>
                  <h2 style={{ color: '#f1f5f9' }}>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={{
                    padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white', borderRadius: '999px', textDecoration: 'none', fontWeight: 700,
                  }}>Back to Home</a>
                </div>
              } />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
