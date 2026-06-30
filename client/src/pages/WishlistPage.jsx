import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import axios from '../api/axios';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';
import './WishlistPage.css';

const WishlistPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get('/wishlist')
      .then(res => setWishlist(res.data.wishlist?.products || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/wishlist/${productId}`);
      setWishlist(prev => prev.filter(p => p._id !== productId));
    } catch {
      console.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: 1,
    });
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1 className="wishlist-title">
          <FiHeart /> {t('nav.wishlist')}
        </h1>
        <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>

        {loading ? (
          <div className="wishlist-loading">Loading your wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <FiHeart size={56} />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products" className="wishlist-shop-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(product => (
              <div key={product._id} className="wishlist-card">
                <Link to={`/products/${product._id}`} className="wishlist-img-link">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/240'}
                    alt={product.name}
                    className="wishlist-product-img"
                  />
                </Link>
                <div className="wishlist-card-body">
                  <Link to={`/products/${product._id}`} className="wishlist-product-name">
                    {product.name}
                  </Link>
                  <div className="wishlist-product-meta">
                    <span className="wishlist-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="wishlist-original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="wishlist-actions">
                    <button className="wishlist-add-cart" onClick={() => handleAddToCart(product)}>
                      <FiShoppingCart /> {t('product.addToCart')}
                    </button>
                    <button className="wishlist-remove" onClick={() => removeFromWishlist(product._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
