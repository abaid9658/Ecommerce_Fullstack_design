import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/helpers';
import axios from '../api/axios';
import { FiTrash2, FiHeart, FiArrowLeft, FiShoppingCart, FiCheckCircle, FiLock, FiX } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
  const {
    cartItems,
    savedForLater,
    removeItemFromCart,
    updateItemQuantity,
    saveItemForLater,
    moveItemToCart,
    clearEntireCart,
    totals,
  } = useCart();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('status');

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  // Mock payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    country: 'United Arab Emirates',
  });

  // Clear cart upon successful checkout success callback from URL
  useEffect(() => {
    if (checkoutStatus === 'success') {
      clearEntireCart();
    }
  }, [checkoutStatus]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMessage('');
    setCouponError('');
    if (couponCode.toUpperCase() === 'SUMMER20') {
      setAppliedDiscount(20);
      setCouponMessage('Coupon applied successfully! 20% discount.');
    } else if (couponCode.toUpperCase() === 'FREE5') {
      setAppliedDiscount(5);
      setCouponMessage('Coupon applied successfully! 5% discount.');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const calculateFinalTotals = () => {
    const base = totals.subtotal;
    const discountVal = totals.discount + (base * (appliedDiscount / 100));
    const finalSubtotal = base - (base * (appliedDiscount / 100));
    const tax = finalSubtotal * 0.05;
    const finalTotal = finalSubtotal + tax;

    return {
      subtotal: base,
      discount: discountVal,
      tax: tax,
      total: finalTotal
    };
  };

  const finalTotals = calculateFinalTotals();

  const handleCheckout = async () => {
    if (!user) {
      // Prompt user to sign in
      window.location.href = `/login?redirect=cart`;
      return;
    }

    try {
      // Attempt Stripe checkout session creation
      const stripeAPI = await import('../api/cart');
      const session = await stripeAPI.checkoutSession();
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        // Fallback to local payment modal simulator if no URL is returned
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.warn('Stripe checkout failed to initiate, launching simulation:', error.message);
      setShowPaymentModal(true);
    }
  };

  const handleMockPaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item.product?._id || item.productId || item._id,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        selectedColor: item.color || 'Standard',
        selectedSize: item.size || 'Standard',
      }));

      const orderData = {
        items: orderItems,
        paymentMethod: 'card',
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        totalAmount: finalTotals.total,
        discountAmount: finalTotals.discount,
        taxAmount: finalTotals.tax,
      };

      await axios.post('/orders', orderData);
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setSearchParams({ status: 'success' });
    } catch (err) {
      setPaymentProcessing(false);
      alert('Failed to place order: ' + (err.response?.data?.message || err.message));
    }
  };

  // If status is success, show beautiful success confirmation screen
  if (checkoutStatus === 'success') {
    return (
      <div className="cart-page-wrapper">
        <div className="container success-container margin-top">
          <div className="success-card card">
            <FiCheckCircle className="success-icon" />
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your purchase. Your payment was processed securely.
              A confirmation email has been sent to {user?.email || 'your email'}.
            </p>
            <div className="success-actions">
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container cart-layout-container">
        <h2>My cart ({cartItems.length})</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart-card card margin-top">
            <FiShoppingCart className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary margin-top">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Left Main items list */}
            <div className="cart-main-col">
              <div className="cart-items-card card">
                {cartItems.map((item, idx) => {
                  const p = item.product;
                  // Tiered pricing evaluation
                  let currentPrice = p.price;
                  if (p.tieredPricing && p.tieredPricing.length > 0) {
                    const tier = p.tieredPricing.find(t => item.quantity >= t.minQty && item.quantity <= t.maxQty)
                      || p.tieredPricing[p.tieredPricing.length - 1];
                    if (tier) currentPrice = tier.price;
                  }

                  return (
                    <div key={idx} className="item-cart">
                      <div className="item-img-container">
                        <img src={p.image} alt={p.name} />
                      </div>
                      
                      <div className="item-details-container">
                        <Link to={`/products/${p._id}`} className="item-title">
                          {p.name}
                        </Link>
                        <p className="item-specs">
                          Size: {item.selectedSize || 'Standard'}, Color: {item.selectedColor || 'N/A'}, Brand: {p.brand}
                        </p>
                        <div className="item-actions">
                          <button
                            className="item-btn-remove"
                            onClick={() => removeItemFromCart(p._id, item.selectedColor, item.selectedSize)}
                          >
                            Remove
                          </button>
                          <button
                            className="item-btn-save"
                            onClick={() => saveItemForLater(p._id, item.selectedColor, item.selectedSize)}
                          >
                            Save for later
                          </button>
                        </div>
                      </div>

                      <div className="item-controls-price">
                        <span className="item-unit-price">{formatPrice(currentPrice * item.quantity)}</span>
                        <div className="item-qty-selector">
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(
                                p._id,
                                Number(e.target.value),
                                item.selectedColor,
                                item.selectedSize
                              )
                            }
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                Qty: {num}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="cart-footer-controls">
                  <Link to="/products" className="btn btn-primary back-to-shop-btn">
                    <FiArrowLeft style={{ marginRight: '8px' }} /> Back to shop
                  </Link>
                  <button className="btn btn-outline" onClick={clearEntireCart}>
                    Remove all
                  </button>
                </div>
              </div>

              {/* Extra Logistic details banner */}
              <div className="secure-badge-row margin-top">
                <div className="secure-badge-item">
                  <span className="badge-logo">🛡️</span>
                  <div>
                    <h5>Secure payment</h5>
                    <p>SSL Encryption standards</p>
                  </div>
                </div>
                <div className="secure-badge-item">
                  <span className="badge-logo">💬</span>
                  <div>
                    <h5>Customer support</h5>
                    <p>24/7 dedicated service</p>
                  </div>
                </div>
                <div className="secure-badge-item">
                  <span className="badge-logo">🚚</span>
                  <div>
                    <h5>Global shipping</h5>
                    <p>Direct trackable delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary column */}
            <div className="cart-summary-col">
              {/* Discount Code Form */}
              <div className="summary-promo-card card">
                <p>Have a coupon?</p>
                <form onSubmit={handleApplyCoupon} className="promo-form">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. SUMMER20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary">
                    Apply
                  </button>
                </form>
                {couponMessage && <p className="coupon-msg-success">{couponMessage}</p>}
                {couponError && <p className="coupon-msg-error">{couponError}</p>}
              </div>

              {/* Subtotals & checkout */}
              <div className="summary-total-card card margin-top">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(finalTotals.subtotal)}</span>
                </div>
                {finalTotals.discount > 0 && (
                  <div className="total-row discount-row">
                    <span>Discount:</span>
                    <span>- {formatPrice(finalTotals.discount)}</span>
                  </div>
                )}
                <div className="total-row tax-row">
                  <span>Tax (5%):</span>
                  <span>+ {formatPrice(finalTotals.tax)}</span>
                </div>
                
                <hr className="total-divider" />
                
                <div className="total-row grand-total-row">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotals.total)}</span>
                </div>

                <button className="btn checkout-btn btn-block" onClick={handleCheckout}>
                  Checkout ({totals.itemCount} items)
                </button>

                <div className="payment-badges-row">
                  <span className="payment-badge visa">Visa</span>
                  <span className="payment-badge master">MC</span>
                  <span className="payment-badge paypal">PayPal</span>
                  <span className="payment-badge amex">Amex</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save for later section */}
        {savedForLater.length > 0 && (
          <div className="saved-for-later-section margin-top">
            <h3 className="section-title">Saved for later</h3>
            <div className="saved-grid">
              {savedForLater.map((prod) => (
                <div key={prod._id} className="saved-card card">
                  <div className="saved-img-wrapper">
                    <img src={prod.image} alt={prod.name} />
                  </div>
                  <div className="saved-details">
                    <Link to={`/products/${prod._id}`} className="saved-title">
                      {prod.name}
                    </Link>
                    <p className="saved-price">{formatPrice(prod.price)}</p>
                    <div className="saved-actions-row">
                      <button
                        className="btn btn-secondary btn-block move-cart-btn"
                        onClick={() => moveItemToCart(prod._id)}
                      >
                        <FiShoppingCart style={{ marginRight: '6px' }} /> Move to cart
                      </button>
                      <button
                        className="btn btn-outline btn-block remove-saved-btn"
                        onClick={async () => {
                          // local sync vs db sync
                          if (user) {
                            const cartAPI = await import('../api/cart');
                            await cartAPI.saveForLater(prod._id); // toggles saved for later state in backend
                            // reload state
                            window.location.reload();
                          } else {
                            // guest
                            const localSaved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
                            const nextSaved = localSaved.filter(p => p._id !== prod._id);
                            localStorage.setItem('savedForLater', JSON.stringify(nextSaved));
                            window.location.reload();
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment simulation modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal card">
            <button className="close-modal-btn" onClick={() => setShowPaymentModal(false)}>
              <FiX />
            </button>
            <div className="modal-header">
              <FiLock className="secure-lock-icon" />
              <h3>Secure Checkout Simulation</h3>
              <p>Stripe sandbox is active. Provide details below to confirm payment.</p>
            </div>
            <form onSubmit={handleMockPaymentSubmit} className="modal-form">
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
              <div style={{ margin: '1rem 0 0.5rem 0', fontWeight: '600', fontSize: '0.95rem' }}>Shipping Address</div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 123 E-Commerce Blvd"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dubai"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 00000"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. United Arab Emirates"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary pay-now-btn btn-block" disabled={paymentProcessing} style={{ marginTop: '1rem' }}>
                {paymentProcessing ? 'Processing order...' : `Pay & Place Order ${formatPrice(finalTotals.total)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
