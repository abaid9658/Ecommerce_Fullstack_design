import React from 'react';
import { Link } from 'react-router';
import { FiHeart, FiStar } from 'react-icons/fi';
import { formatPrice, getStarsArray } from '../../utils/helpers';
import './ProductListItem.jsx.css';

const ProductListItem = ({ product, isWishlisted, onWishlistToggle }) => {
  const stars = getStarsArray(product.rating || 0);

  return (
    <div className="product-list-item card">
      {/* Product Image */}
      <div className="list-img-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Product Details Content */}
      <div className="list-details-wrapper">
        <div className="list-details-header">
          <Link to={`/products/${product._id}`} className="list-product-title">
            {product.name}
          </Link>
          <button
            className={`list-wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={() => onWishlistToggle(product._id)}
          >
            <FiHeart fill={isWishlisted ? 'var(--danger-color)' : 'none'} />
          </button>
        </div>

        {/* Pricing & Ratings Row */}
        <div className="list-price-rating-row">
          <div className="list-prices">
            <span className="list-current-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="list-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="list-rating-block">
            <div className="stars">
              {stars.map((type, idx) => (
                <FiStar
                  key={idx}
                  fill={type === 'full' ? 'var(--warning-color)' : 'none'}
                  color={type === 'full' || type === 'half' ? 'var(--warning-color)' : 'var(--text-muted)'}
                />
              ))}
            </div>
            <span className="list-rating-score">{product.rating || 0}</span>
            <span className="list-dot-separator">•</span>
            <span className="list-orders-count">{product.orderCount || 0} orders</span>
            <span className="list-dot-separator">•</span>
            {product.freeShipping && (
              <span className="list-shipping-badge">Free Shipping</span>
            )}
          </div>
        </div>

        {/* Description & Link */}
        <p className="list-description">{product.description}</p>
        <Link to={`/products/${product._id}`} className="list-details-link">
          View details
        </Link>
      </div>
    </div>
  );
};

export default ProductListItem;
