import React from 'react';
import { Link } from 'react-router';
import { FiHeart, FiStar } from 'react-icons/fi';
import { formatPrice, getStarsArray } from '../../utils/helpers';
import { usePageTranslations, useLocalizedProduct } from '../../hooks/useLocalization';
import './ProductGridCard.css';

const ProductGridCard = ({ product, isWishlisted, onWishlistToggle }) => {
  const stars = getStarsArray(product.rating || 0);
  const { addToCart, inStock, outOfStock } = usePageTranslations();
  const { localizeProduct } = useLocalizedProduct();
  const localProduct = localizeProduct(product);

  return (
    <div className="product-grid-card card">
      {/* Product Image */}
      <div className="grid-img-wrapper">
        <img src={product.image} alt={product.name} />
        <button
          className={`grid-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => onWishlistToggle(product._id)}
        >
          <FiHeart fill={isWishlisted ? 'var(--danger-color)' : 'none'} />
        </button>
      </div>

      {/* Product Info */}
      <div className="grid-details-wrapper">
        {/* Prices */}
        <div className="grid-price-row">
          <span className="grid-current-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="grid-original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Rating */}
        <div className="grid-rating-row">
          <div className="stars">
            {stars.map((type, idx) => (
              <FiStar
                key={idx}
                fill={type === 'full' ? 'var(--warning-color)' : 'none'}
                color={type === 'full' || type === 'half' ? 'var(--warning-color)' : 'var(--text-muted)'}
                size={14}
              />
            ))}
          </div>
          <span className="grid-rating-score">{product.rating || 0}</span>
        </div>

        {/* Name Title */}
        <Link to={`/products/${product._id}`} className="grid-product-title">
          {product.name}
        </Link>
      </div>
    </div>
  );
};

export default ProductGridCard;
