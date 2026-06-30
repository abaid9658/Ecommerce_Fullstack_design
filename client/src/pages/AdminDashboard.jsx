import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from '../api/axios';
import * as productsAPI from '../api/products';
import { formatPrice } from '../utils/helpers';
import { io } from 'socket.io-client';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiStar,
  FiSettings, FiTrendingUp, FiPlus, FiEdit, FiTrash2, FiEye,
  FiAlertCircle, FiCheckCircle, FiX, FiSearch, FiRefreshCw,
  FiDollarSign, FiBarChart2, FiList, FiBell, FiMessageSquare, FiSend
} from 'react-icons/fi';
import './AdminDashboard.css';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

// ——————————————————————————————
// Stat Card Component
// ——————————————————————————————
const StatCard = ({ icon, label, value, change, color }) => (
  <div className="adm-stat-card">
    <div className="adm-stat-icon" style={{ background: `${color}22`, color }}>
      {icon}
    </div>
    <div className="adm-stat-info">
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-label">{label}</div>
    </div>
    {change !== undefined && (
      <div className={`adm-stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </div>
    )}
  </div>
);

// ——————————————————————————————
// Main AdminDashboard Component
// ——————————————————————————————
const AdvancedAdminPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', originalPrice: '', category: 'Electronics',
    brand: '', stock: 10, description: '', shortDescription: '',
    image: '', condition: 'Brand new', colors: '', sizes: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: '', expiryDate: '' });
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState(null);

  // image upload state
  const [imgUploading, setImgUploading] = useState(false);
  const imgFileRef = useRef(null);

  // settings state
  const [settings, setSettings] = useState({
    storeName: '', email: '', contactNumber: '', address: '',
    taxRate: '', shippingCharge: '', codEnabled: true, stripeEnabled: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    axios.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  // Real-time socket (global admin listeners)
  useEffect(() => {
    const s = io('/', { withCredentials: true });

    s.on('new_user', () => {
      fetchStats();
      addNotification('New customer registered');
    });
    s.on('new_sale', (data) => {
      fetchOrders();
      addNotification(`New order placed — $${data.amount?.toFixed(2)} by ${data.customerName}`);
    });
    s.on('product_change', () => {
      fetchProducts();
    });
    s.on('new_review', (data) => {
      addNotification(`New review on "${data.productName}" — ${data.rating}★ by ${data.customerName}`);
    });
    s.on('order_status_update', () => {
      fetchOrders();
    });

    if (activeTab === 'chat') {
      s.emit('join_chat_support');
      s.on('server_message', (data) => {
        setChatMessages(prev => [...prev, data]);
      });
    }

    setSocket(s);
    return () => s.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Removed chat state

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const [ordRes, usersRes, prodsRes] = await Promise.all([
        axios.get('/orders/all').catch(() => ({ data: [] })),
        axios.get('/auth/users').catch(() => ({ data: { users: [] } })),
        productsAPI.getProducts({ limit: 1 }).catch(() => ({ total: 0 })),
      ]);
      const orderList = ordRes.data.orders || ordRes.data || [];
      const revenue = orderList.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const userCount = usersRes.data?.users?.length || usersRes.data?.length || 0;
      setStats({
        totalRevenue: revenue,
        totalOrders: orderList.length,
        totalProducts: prodsRes.total || 0,
        totalUsers: userCount,
      });
    } catch {}
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback((text) => {
    setNotifications(prev => [{ id: Date.now(), text, time: 'just now', read: false }, ...prev.slice(0, 19)]);
  }, []);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'superadmin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch data
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await productsAPI.getProducts({ limit: 100 });
      setProducts(data.products || []);
      setStats(prev => ({ ...prev, totalProducts: data.total || data.products?.length || 0 }));
    } catch (e) { console.error(e); }
    finally { setLoadingProducts(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/orders/all');
      const orderList = res.data.orders || res.data || [];
      setOrders(orderList);
      const revenue = orderList.reduce((s, o) => s + (o.totalAmount || 0), 0);
      setStats(prev => ({ ...prev, totalOrders: orderList.length, totalRevenue: revenue }));
    } catch (e) { console.error(e); }
    finally { setLoadingOrders(false); }
  }, []);

  const fetchCoupons = useCallback(async () => {
    setLoadingCoupons(true);
    try {
      const res = await axios.get('/coupons');
      setCoupons(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingCoupons(false); }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
    fetchCoupons();
  }, [fetchProducts, fetchOrders, fetchStats, fetchCoupons]);

  // Product CRUD
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', originalPrice: '', category: 'Electronics', brand: '', stock: 10, description: '', shortDescription: '', image: '', condition: 'Brand new', colors: '', sizes: '' });
    setFormMsg({ type: '', text: '' });
    setShowProductModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '', price: p.price || '', originalPrice: p.originalPrice || '',
      category: p.category || 'Electronics', brand: p.brand || '',
      stock: p.stock || 0, description: p.description || '',
      shortDescription: p.shortDescription || '',
      image: p.images?.[0] || p.image || '', condition: p.condition || 'Brand new',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : ''
    });
    setFormMsg({ type: '', text: '' });
    setShowProductModal(true);
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      const payload = { 
        ...productForm, 
        images: productForm.image ? [productForm.image] : [],
        colors: productForm.colors.split(',').map(c => c.trim()).filter(c => c),
        sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s)
      };
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, payload);
        setFormMsg({ type: 'success', text: 'Product updated!' });
      } else {
        await productsAPI.createProduct(payload);
        setFormMsg({ type: 'success', text: 'Product created!' });
      }
      fetchProducts();
      setTimeout(() => setShowProductModal(false), 800);
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save product' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.deleteProduct(id);
      fetchProducts();
    } catch { alert('Delete failed'); }
  };
  const handleCouponSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/coupons', {
        code: couponForm.code,
        discountType: 'percentage',
        discountValue: Number(couponForm.discountPercentage),
        expiryDate: couponForm.expiryDate
      });
      fetchCoupons();
      setShowCouponModal(false);
      setCouponForm({ code: '', discountPercentage: '', expiryDate: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };
  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch { alert('Delete failed'); }
  };

  // Image upload handler (local file → base64 → server)
  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await axios.post('/upload', { image: reader.result });
          setProductForm(prev => ({ ...prev, image: res.data.url }));
        } catch {
          alert('Image upload failed');
        } finally {
          setImgUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setImgUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    setSettingsMsg({ type: '', text: '' });
    try {
      await axios.put('/settings', settings);
      setSettingsMsg({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch { alert('Failed to update order'); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // ——————————————————————————————
  // Sidebar Nav Items
  // ——————————————————————————————
  const navItems = [
    { key: 'dashboard', icon: <FiGrid />, label: t('admin.dashboard') || 'Dashboard' },
    { key: 'products', icon: <FiPackage />, label: t('admin.products') || 'Products' },
    { key: 'orders', icon: <FiShoppingBag />, label: t('admin.orders') || 'Orders' },
    { key: 'coupons', icon: <FiTag />, label: t('admin.coupons') || 'Coupons' }
  ];

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className={`adm-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="adm-sidebar-header">
          <span className="adm-logo">🛒</span>
          {isSidebarOpen && <span className="adm-logo-text">Admin Panel</span>}
        </div>

        <nav className="adm-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`adm-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
              title={item.label}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="adm-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <Link to="/" className="adm-nav-item" title="Back to Store">
            <span className="adm-nav-icon"><FiEye /></span>
            {isSidebarOpen && <span className="adm-nav-label">View Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="adm-main">
        {/* Top Bar */}
        <header className="adm-topbar">
          <button className="adm-toggle-btn" onClick={() => setIsSidebarOpen(v => !v)}>
            <FiList />
          </button>
          <h1 className="adm-page-title">
            {navItems.find(n => n.key === activeTab)?.label}
          </h1>
          <div className="adm-topbar-right">
            {/* Notifications */}
            <div className="adm-notif-wrapper">
              <button className="adm-notif-btn" onClick={() => setShowNotifPanel(v => !v)}>
                <FiBell />
                {unreadCount > 0 && <span className="adm-notif-badge">{unreadCount}</span>}
              </button>
              {showNotifPanel && (
                <div className="adm-notif-panel">
                  <div className="adm-notif-header">
                    <span>Notifications</span>
                    <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
                      Mark all read
                    </button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`adm-notif-item ${n.read ? 'read' : ''}`}>
                      <span className="adm-notif-dot" />
                      <div>
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="adm-user-chip">
              <div className="adm-user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              {isSidebarOpen && <span>{user?.name?.split(' ')[0]}</span>}
            </div>
          </div>
        </header>

        <div className="adm-content">

          {/* ——————————————— DASHBOARD ——————————————— */}
          {activeTab === 'dashboard' && (
            <div className="adm-dashboard">
              {/* Stat Cards */}
              <div className="adm-stats-grid">
                <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change={12.5} color="#22c55e" />
                <StatCard icon={<FiShoppingBag />} label="Total Orders" value={stats.totalOrders} change={8.2} color="#3b82f6" />
                <StatCard icon={<FiPackage />} label="Total Products" value={stats.totalProducts} change={3.1} color="#8b5cf6" />
                <StatCard icon={<FiUsers />} label="Total Customers" value={stats.totalUsers} change={5.7} color="#f59e0b" />
              </div>

              {/* Recent Orders */}
              <div className="adm-chart-card" style={{ marginTop: '1.5rem' }}>
                <div className="adm-chart-header">
                  <h3>Recent Orders</h3>
                  <button className="adm-view-all-btn" onClick={() => setActiveTab('orders')}>View All</button>
                </div>
                <div className="adm-table-wrapper">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td className="adm-order-id">#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{order.user?.name || 'Guest'}</td>
                          <td className="adm-price">${order.totalAmount?.toFixed(2)}</td>
                          <td>
                            <span className="adm-status-badge" style={{ background: `${STATUS_COLORS[order.status] || '#64748b'}22`, color: STATUS_COLORS[order.status] || '#64748b' }}>
                              {order.status}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ——————————————— PRODUCTS ——————————————— */}
          {activeTab === 'products' && (
            <div className="adm-products">
              <div className="adm-section-header">
                <div className="adm-search-row">
                  <FiSearch className="adm-search-icon" />
                  <input
                    className="adm-search-input"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                  />
                </div>
                <div className="adm-header-actions">
                  <button className="adm-refresh-btn" onClick={fetchProducts}><FiRefreshCw /></button>
                  <button className="adm-add-btn" onClick={openAddModal}><FiPlus /> Add Product</button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="adm-loading">Loading products...</div>
              ) : (
                <div className="adm-table-wrapper">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p._id}>
                          <td>
                            <img
                              src={p.images?.[0] || 'https://via.placeholder.com/48'}
                              alt={p.name}
                              className="adm-product-thumb"
                            />
                          </td>
                          <td className="adm-product-name">{p.name}</td>
                          <td><span className="adm-category-tag">{p.category}</span></td>
                          <td className="adm-price">${p.price}</td>
                          <td>
                            <span className={`adm-stock ${p.stock < 5 ? 'low' : ''}`}>
                              {p.stock < 5 && <FiAlertCircle style={{ marginRight: '4px' }} />}
                              {p.stock}
                            </span>
                          </td>
                          <td>
                            <div className="adm-actions">
                              <button className="adm-btn-edit" onClick={() => openEditModal(p)}><FiEdit /></button>
                              <button className="adm-btn-delete" onClick={() => handleDeleteProduct(p._id)}><FiTrash2 /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No products found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ——————————————— ORDERS ——————————————— */}
          {activeTab === 'orders' && (
            <div className="adm-orders">
              <div className="adm-section-header">
                <h2>All Orders</h2>
                <button className="adm-refresh-btn" onClick={fetchOrders}><FiRefreshCw /></button>
              </div>
              {loadingOrders ? (
                <div className="adm-loading">Loading orders...</div>
              ) : (
                <div className="adm-table-wrapper">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td className="adm-order-id">#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{order.user?.name || 'Guest'}<br /><small style={{ color: '#64748b' }}>{order.user?.email}</small></td>
                          <td>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                          <td className="adm-price">${order.totalAmount?.toFixed(2)}</td>
                          <td><span className="adm-payment-badge">{order.paymentMethod?.toUpperCase()}</span></td>
                          <td>
                            <select
                              className="adm-status-select"
                              value={order.status}
                              onChange={e => updateOrderStatus(order._id, e.target.value)}
                              style={{ color: STATUS_COLORS[order.status] }}
                            >
                              {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button className="adm-btn-view" onClick={() => navigate(`/track-order`)}>
                              <FiEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ——————————————— COUPONS ——————————————— */}
          {activeTab === 'coupons' && (
            <div className="adm-coupons">
              <div className="adm-section-header">
                <h2>Coupon Management</h2>
                <div className="adm-header-actions">
                  <button className="adm-refresh-btn" onClick={fetchCoupons}><FiRefreshCw /></button>
                  <button className="adm-add-btn" onClick={() => setShowCouponModal(true)} style={{ display: 'inline-flex' }}>
                    <FiPlus /> Create Coupon
                  </button>
                </div>
              </div>
              {loadingCoupons ? (
                <div className="adm-loading">Loading coupons...</div>
              ) : (
                <div className="adm-table-wrapper" style={{ marginTop: '1rem' }}>
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Code</th><th>Discount (%)</th><th>Expiry Date</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(coupon => (
                        <tr key={coupon._id}>
                          <td><strong>{coupon.code}</strong></td>
                          <td>{coupon.discountValue}%</td>
                          <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                          <td>
                            <button className="adm-btn-delete" onClick={() => handleDeleteCoupon(coupon._id)}><FiTrash2 /></button>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No coupons found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="adm-modal-overlay" onClick={() => setShowCouponModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="adm-modal-header">
              <h2>Create Coupon</h2>
              <button className="adm-modal-close" onClick={() => setShowCouponModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleCouponSave} className="adm-modal-form">
              <div className="adm-form-field">
                <label>Coupon Code</label>
                <input type="text" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} required placeholder="e.g. SUMMER20" />
              </div>
              <div className="adm-form-field">
                <label>Discount Percentage (%)</label>
                <input type="number" value={couponForm.discountPercentage} onChange={e => setCouponForm({ ...couponForm, discountPercentage: e.target.value })} required min="1" max="100" />
              </div>
              <div className="adm-form-field">
                <label>Expiry Date</label>
                <input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} required />
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-cancel" onClick={() => setShowCouponModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn-save"><FiCheckCircle /> Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="adm-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="adm-modal-close" onClick={() => setShowProductModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleProductSave} className="adm-modal-form">
              <div className="adm-form-grid">
                {[
                  { key: 'name', label: 'Product Name', type: 'text', required: true },
                  { key: 'price', label: 'Sale Price ($)', type: 'number', required: true },
                  { key: 'originalPrice', label: 'Original Price ($)', type: 'number' },
                  { key: 'stock', label: 'Stock Qty', type: 'number', required: true },
                  { key: 'brand', label: 'Brand', type: 'text', required: true },
                  { key: 'colors', label: 'Colors (comma separated)', type: 'text', required: true },
                  { key: 'sizes', label: 'Sizes (comma separated)', type: 'text', required: true },
                ].map(f => (
                  <div key={f.key} className="adm-form-field">
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      value={productForm[f.key]}
                      onChange={e => setProductForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      required={f.required}
                    />
                  </div>
                ))}
              </div>

              {/* Image: URL or file upload */}
              <div className="adm-form-field">
                <label>Product Image</label>
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={productForm.image}
                  onChange={e => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>— or upload —</span>
                  <input
                    ref={imgFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileUpload}
                  />
                  <button
                    type="button"
                    className="adm-btn-edit"
                    onClick={() => imgFileRef.current?.click()}
                    disabled={imgUploading}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    {imgUploading ? 'Uploading...' : '📁 Browse'}
                  </button>
                  {productForm.image && (
                    <img src={productForm.image} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #334155' }} />
                  )}
                </div>
              </div>
              <div className="adm-form-field">
                <label>Category</label>
                <select value={productForm.category} onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}>
                  {['Electronics', 'Smartphones', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Toys', 'Beauty'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="adm-form-field">
                <label>Short Description</label>
                <input type="text" value={productForm.shortDescription} onChange={e => setProductForm(prev => ({ ...prev, shortDescription: e.target.value }))} />
              </div>
              <div className="adm-form-field">
                <label>Full Description</label>
                <textarea rows="3" value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>

              {formMsg.text && (
                <div className={`adm-form-msg ${formMsg.type}`}>{formMsg.text}</div>
              )}

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-cancel" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn-save">
                  {editingProduct ? <><FiCheckCircle /> Update Product</> : <><FiPlus /> Create Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAdminPage;
