import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, getStarsArray } from '../../utils/helpers';
import { usePageTranslations, useLocalizedProduct } from '../../hooks/useLocalization';
import { FiStar, FiCheck, FiShoppingCart } from 'react-icons/fi';
import './ProductInfo.css';

const ProductInfo = ({ product }) => {
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const { t, addToCart, inStock, outOfStock } = usePageTranslations();
  const { localizeField } = useLocalizedProduct();

  const colorOptions = product.colors && product.colors.length > 0 ? product.colors : ['Blue', 'Red', 'Gray', 'Black'];
  const sizeOptions = product.sizes && product.sizes.length > 0 ? product.sizes : ['Small', 'Medium', 'Large'];
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = () => {
    if (colorOptions.length > 0 && !selectedColor) {
      setErrorMsg('Please select a color');
      return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      setErrorMsg('Please select a size');
      return;
    }
    setErrorMsg('');
    addItemToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stars = getStarsArray(product.rating || 0);

  // Fallback tiered pricing mock matching Figma details screen
  const defaultTiers = [
    { minQty: 50, maxQty: 100, price: 98.00 },
    { minQty: 101, maxQty: 700, price: 90.00 },
    { minQty: 701, maxQty: 10000, price: 78.00 }
  ];

  const tiers = product.tieredPricing && product.tieredPricing.length > 0
    ? product.tieredPricing
    : defaultTiers;

  const specList = product.specs
    ? Object.entries(product.specs)
    : [
        ['Type', 'Classic shoes'],
        ['Material', 'Plastic material'],
        ['Design', 'Modern nice']
      ];

  return (
    <div className="product-info-panel">
      {/* 1. Availability */}
      <div className="stock-badge-row">
        <span className="stock-badge">
          <FiCheck /> In stock
        </span>
      </div>

      {/* 2. Title Name */}
      <h2 className="info-product-title">{product.name}</h2>

      {/* 3. Ratings Summary */}
      <div className="info-rating-row">
        <div className="stars">
          {stars.map((type, idx) => (
            <FiStar
              key={idx}
              fill={type === 'full' ? 'var(--warning-color)' : 'none'}
              color={type === 'full' || type === 'half' ? 'var(--warning-color)' : 'var(--text-muted)'}
            />
          ))}
        </div>
        <span className="rating-val">{product.rating || 0}</span>
        <span className="dot-sep">•</span>
        <span className="reviews-count">{product.reviewCount || 0} reviews</span>
        <span className="dot-sep">•</span>
        <span className="sold-count">{product.orderCount || 0} sold</span>
      </div>

      {/* 4. Tiered Pricing Block */}
      <div className="tiered-pricing-block">
        {tiers.map((tier, idx) => (
          <div key={idx} className="tier-price-box">
            <h4 className="tier-price">{formatPrice(tier.price)}</h4>
            <p className="tier-qty">
              {tier.minQty}-{tier.maxQty} pcs
            </p>
          </div>
        ))}
      </div>

      {/* 5. Custom Attributes Selection */}
      <div className="attribute-selection-block">
        <div className="attribute-row">
          <span className="attribute-label">Color:</span>
          <div className="color-options">
            {colorOptions.map((col) => (
              <button
                key={col}
                className={`attr-btn color-btn ${selectedColor === col ? 'active' : ''}`}
                onClick={() => { setSelectedColor(col); setErrorMsg(''); }}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        <div className="attribute-row">
          <span className="attribute-label">Size:</span>
          <div className="size-options">
            {sizeOptions.map((sz) => (
              <button
                key={sz}
                className={`attr-btn size-btn ${selectedSize === sz ? 'active' : ''}`}
                onClick={() => { setSelectedSize(sz); setErrorMsg(''); }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className="attribute-row">
          <span className="attribute-label">Qty:</span>
          <div className="qty-controls">
            <button
              className="qty-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 6. Specifications Metadata List */}
      <div className="specifications-summary-list">
        {specList.map(([key, val], idx) => (
          <div key={idx} className="spec-row">
            <span className="spec-label">{key}:</span>
            <span className="spec-value">{val}</span>
          </div>
        ))}
      </div>

      {/* 7. Action Button */}
      <div className="add-to-cart-wrapper margin-top">
        {errorMsg && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>⚠️ {errorMsg}</p>
        )}
        <button
          className="btn btn-primary add-cart-btn"
          onClick={handleAddToCart}
          disabled={added}
        >
          <FiShoppingCart className="cart-btn-icon" />
          {added ? 'Added!' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
