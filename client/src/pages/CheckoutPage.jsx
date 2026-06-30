import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import axios from '../api/axios';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { t } = useLanguage();
  const { cartItems, totals, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleShippingChange = (e) => {
    setShippingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyCoupon = async () => {
    try {
      const res = await axios.post('/coupons/validate', { code: couponCode });
      if (res.data.valid) {
        const discount = res.data.discountType === 'percentage'
          ? (totals.subtotal * res.data.discountValue) / 100
          : res.data.discountValue;
        setCouponDiscount(discount);
        setError('');
      } else {
        setError('Invalid or expired coupon code');
      }
    } catch {
      setError('Coupon validation failed');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.color,
          selectedSize: item.size,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        totalAmount: totals.subtotal + totals.shipping + totals.tax - couponDiscount,
        discountAmount: couponDiscount,
        taxAmount: totals.tax,
      };

      if (paymentMethod === 'stripe') {
        const res = await axios.post('/stripe/create-checkout-session', {
          items: cartItems,
          shippingAddress: shippingData,
          couponCode,
        });
        window.location.href = res.data.url;
      } else {
        await axios.post('/orders', orderData);
        clearCart?.();
        navigate('/order-success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = totals.subtotal + totals.shipping + totals.tax - couponDiscount;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Step Indicator */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <div className="checkout-content">
          {/* Left: Form */}
          <div className="checkout-form-area">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="checkout-section">
                <h2 className="section-title">{t('checkout.shippingAddress')}</h2>
                <div className="form-grid">
                  {[
                    { name: 'firstName', label: t('checkout.firstName'), type: 'text' },
                    { name: 'lastName', label: t('checkout.lastName'), type: 'text' },
                    { name: 'email', label: t('checkout.email'), type: 'email' },
                    { name: 'phone', label: t('checkout.phone'), type: 'tel' },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="form-group">
                      <label>{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={shippingData[name]}
                        onChange={handleShippingChange}
                        placeholder={label}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group full-width">
                  <label>{t('checkout.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    placeholder="Street address, apartment, suite..."
                    required
                  />
                </div>
                <div className="form-grid">
                  {[
                    { name: 'city', label: t('checkout.city') },
                    { name: 'state', label: t('checkout.state') },
                    { name: 'zipCode', label: t('checkout.zipCode') },
                  ].map(({ name, label }) => (
                    <div key={name} className="form-group">
                      <label>{label}</label>
                      <input
                        type="text"
                        name={name}
                        value={shippingData[name]}
                        onChange={handleShippingChange}
                        placeholder={label}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group full-width">
                  <label>{t('checkout.country')}</label>
                  <select name="country" value={shippingData.country} onChange={handleShippingChange}>
                    {['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Saudi Arabia', 'UAE', 'Pakistan', 'India', 'Australia'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button className="checkout-btn-next" onClick={() => setStep(1)}>
                  {t('checkout.next')} →
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="section-title">{t('checkout.paymentMethod')}</h2>
                <div className="payment-options">
                  {[
                    { value: 'cod', label: t('checkout.cashOnDelivery'), icon: '💵' },
                    { value: 'stripe', label: t('checkout.creditCard'), icon: '💳' },
                    { value: 'bank', label: t('checkout.bankTransfer'), icon: '🏦' },
                  ].map(opt => (
                    <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                      />
                      <span className="payment-icon">{opt.icon}</span>
                      <span className="payment-label">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="stripe-notice">
                    <p>🔒 You will be securely redirected to Stripe to complete payment.</p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bank-info">
                    <p><strong>Bank:</strong> National Bank</p>
                    <p><strong>Account:</strong> 1234-5678-9012</p>
                    <p><strong>IBAN:</strong> US00 NBXX 0000 0000 1234</p>
                    <p>Please use your Order ID as the payment reference.</p>
                  </div>
                )}

                <div className="coupon-row">
                  <input
                    type="text"
                    placeholder={t('cart.couponCode')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={applyCoupon}>{t('cart.apply')}</button>
                </div>
                {couponDiscount > 0 && (
                  <p className="coupon-success">✓ Coupon applied! Saving ${couponDiscount.toFixed(2)}</p>
                )}

                <div className="checkout-nav-btns">
                  <button className="checkout-btn-back" onClick={() => setStep(0)}>← {t('checkout.back')}</button>
                  <button className="checkout-btn-next" onClick={() => setStep(2)}>{t('checkout.next')} →</button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="section-title">Review Your Order</h2>

                <div className="review-section">
                  <h3>Shipping To</h3>
                  <p>{shippingData.firstName} {shippingData.lastName}</p>
                  <p>{shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                  <p>{shippingData.country}</p>
                  <p>📧 {shippingData.email} | 📞 {shippingData.phone}</p>
                </div>

                <div className="review-section">
                  <h3>Payment</h3>
                  <p>{paymentMethod === 'cod' ? '💵 Cash on Delivery' : paymentMethod === 'stripe' ? '💳 Credit Card (Stripe)' : '🏦 Bank Transfer'}</p>
                </div>

                <div className="review-items">
                  {cartItems.map((item, i) => (
                    <div key={i} className="review-item">
                      <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                      <div className="review-item-info">
                        <span className="review-item-name">{item.name}</span>
                        <span className="review-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {error && <div className="checkout-error">{error}</div>}

                <div className="checkout-nav-btns">
                  <button className="checkout-btn-back" onClick={() => setStep(1)}>← {t('checkout.back')}</button>
                  <button
                    className="checkout-btn-place"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `${t('checkout.confirm')} - $${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary">
            <h3 className="summary-title">{t('checkout.orderSummary')}</h3>
            <div className="summary-items">
              {cartItems.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>{t('cart.subtotal')}</span><span>${totals.subtotal?.toFixed(2)}</span></div>
            <div className="summary-row"><span>{t('cart.shipping')}</span><span>${totals.shipping?.toFixed(2)}</span></div>
            <div className="summary-row"><span>{t('cart.tax')}</span><span>${totals.tax?.toFixed(2)}</span></div>
            {couponDiscount > 0 && (
              <div className="summary-row discount"><span>Coupon Discount</span><span>-${couponDiscount.toFixed(2)}</span></div>
            )}
            <div className="summary-divider" />
            <div className="summary-total"><span>{t('cart.total')}</span><span>${finalTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
