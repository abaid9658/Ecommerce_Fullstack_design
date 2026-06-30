import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { FiPackage, FiHeart, FiMapPin, FiLogOut, FiUser, FiEdit2, FiCamera } from 'react-icons/fi';
import './ProfilePage.css';

const TAB_ITEMS = ['orders', 'wishlist', 'addresses', 'settings'];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', zipCode: '', country: '', isDefault: false });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const fetchOrders = () => {
    setLoadingOrders(true);
    axios.get('/orders/my-orders')
      .then(res => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  };

  const fetchWishlist = () => {
    setLoadingWishlist(true);
    axios.get('/wishlist')
      .then(res => setWishlist(res.data.products || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoadingWishlist(false));
  };

  const fetchAddresses = () => {
    setLoadingAddresses(true);
    axios.get('/auth/profile')
      .then(res => setAddresses(res.data.addresses || []))
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false));
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;
    const socket = io('/', { withCredentials: true });
    socket.on('order_status_update', (data) => {
      // Refresh orders if updated
      fetchOrders();
    });
    return () => socket.disconnect();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await axios.put('/auth/update-profile', { name, phone });
      setSaveSuccess('Profile updated!');
      setEditProfile(false);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch {
      setSaveSuccess('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/address', addressForm);
      setAddresses(res.data);
      setShowAddressModal(false);
      setAddressForm({ street: '', city: '', zipCode: '', country: '', isDefault: false });
    } catch {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await axios.delete(`/auth/address/${id}`);
      setAddresses(res.data);
    } catch {
      alert('Failed to delete address');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ORDER_STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <button className="avatar-upload-btn" title="Change Avatar">
                <FiCamera />
              </button>
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="admin-badge">Admin</span>
            )}
          </div>

          <nav className="profile-nav">
            {[
              { key: 'orders', icon: <FiPackage />, label: 'My Orders' },
              { key: 'wishlist', icon: <FiHeart />, label: 'Wishlist' },
              { key: 'addresses', icon: <FiMapPin />, label: 'Addresses' },
              { key: 'settings', icon: <FiUser />, label: 'Account Settings' },
            ].map(item => (
              <button
                key={item.key}
                className={`profile-nav-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {user?.role === 'admin' && (
              <Link to="/admin" className="profile-nav-item admin-link">
                <FiUser />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button className="profile-nav-item logout-btn" onClick={handleLogout}>
              <FiLogOut />
              <span>{t('nav.logout')}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="profile-section">
              <h2 className="profile-section-title">My Orders</h2>
              {loadingOrders ? (
                <div className="profile-loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="profile-empty">
                  <FiPackage size={48} />
                  <p>No orders yet.</p>
                  <Link to="/products" className="shop-now-btn">Start Shopping</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span
                          className="order-status-badge"
                          style={{ background: `${ORDER_STATUS_COLORS[order.status] || '#64748b'}22`, color: ORDER_STATUS_COLORS[order.status] || '#64748b', border: `1px solid ${ORDER_STATUS_COLORS[order.status] || '#64748b'}44` }}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </div>
                      <div className="order-items-preview">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} className="order-item-mini">
                            <span className="order-item-name">{item.product?.name || 'Product'}</span>
                            <span className="order-item-qty">×{item.quantity}</span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 3 && (
                          <span className="more-items">+{order.items.length - 3} more</span>
                        )}
                      </div>
                      <div className="order-card-footer">
                        <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                        <span className="order-payment">{order.paymentMethod?.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="profile-section">
              <h2 className="profile-section-title">My Wishlist</h2>
              {loadingWishlist ? (
                <div className="profile-loading">Loading wishlist...</div>
              ) : wishlist.length === 0 ? (
                <div className="profile-empty">
                  <FiHeart size={48} />
                  <p>Your wishlist is empty.</p>
                  <Link to="/products" className="shop-now-btn">Browse Products</Link>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map((item) => {
                    const prod = item.product || item;
                    return (
                      <Link to={`/products/${prod._id}`} key={prod._id} className="wishlist-item-card">
                        <div className="wishlist-img-wrapper">
                          <img src={prod.images?.[0] || prod.image || 'https://via.placeholder.com/150'} alt={prod.name} />
                        </div>
                        <div className="wishlist-info">
                          <h4>{prod.name}</h4>
                          <p className="wishlist-price">${(prod.price || 0).toFixed(2)}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="profile-section">
              <div className="profile-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="profile-section-title" style={{ margin: 0 }}>Saved Addresses</h2>
                <button className="shop-now-btn" onClick={() => setShowAddressModal(true)}>+ Add Address</button>
              </div>

              {loadingAddresses ? (
                <div className="profile-loading">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="profile-empty">
                  <FiMapPin size={48} />
                  <p>No saved addresses yet.</p>
                </div>
              ) : (
                <div className="addresses-list" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {addresses.map((addr) => (
                    <div key={addr._id} className="card" style={{ padding: '1.25rem', position: 'relative', border: addr.isDefault ? '2px solid #0d6efd' : '1px solid #dee2e6' }}>
                      {addr.isDefault && <span className="badge" style={{ backgroundColor: '#0d6efd', color: '#fff', position: 'absolute', top: '10px', right: '10px', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Default</span>}
                      <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>{addr.street}</p>
                      <p style={{ margin: '0 0 0.25rem', color: '#6c757d' }}>{addr.city}, {addr.zipCode}</p>
                      <p style={{ margin: '0 0 1rem', color: '#6c757d' }}>{addr.country}</p>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteAddress(addr._id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Account Settings</h2>
              {saveSuccess && <div className="save-success">{saveSuccess}</div>}
              <div className="settings-form">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editProfile}
                  />
                </div>
                <div className="settings-field">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} disabled />
                  <span className="field-note">Email cannot be changed</span>
                </div>
                <div className="settings-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!editProfile}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="settings-field">
                  <label>Member Since</label>
                  <input type="text" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} disabled />
                </div>

                <div className="settings-actions">
                  {editProfile ? (
                    <>
                      <button className="btn-save" onClick={handleSaveProfile}>Save Changes</button>
                      <button className="btn-cancel" onClick={() => setEditProfile(false)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn-edit" onClick={() => setEditProfile(true)}>
                      <FiEdit2 /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button className="close-btn" onClick={() => setShowAddressModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleAddAddress} className="inquiry-form">
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>ZIP / Postal Code</label>
                <input type="text" value={addressForm.zipCode} onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                <label htmlFor="isDefault" style={{ margin: 0, cursor: 'pointer' }}>Set as default address</label>
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
