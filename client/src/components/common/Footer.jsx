import React, { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube, FiSend } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-wrapper">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">
          <div className="newsletter-text">
            <h3>{t('footer.subscribe')}</h3>
            <p>Get the latest deals, products, and news delivered to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              <FiSend />
              {subscribed ? 'Subscribed! ✓' : t('footer.subscribeBtn')}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon-footer">🛒</span>
              <span className="logo-text-footer">Brand</span>
            </Link>
            <p className="brand-description">
              Your trusted online marketplace connecting millions of buyers with thousands of verified sellers worldwide.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          {/* About Links */}
          <div className="footer-links-col">
            <h4 className="links-title">Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blogs">Blog</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Shop Links */}
          <div className="footer-links-col">
            <h4 className="links-title">Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?tag=offers">Hot Offers</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
            </ul>
          </div>

          {/* Policy Links */}
          <div className="footer-links-col">
            <h4 className="links-title">Policies</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Account + App */}
          <div className="footer-links-col">
            <h4 className="links-title">Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/profile">My Orders</Link></li>
            </ul>
            <h4 className="links-title" style={{ marginTop: '1.2rem' }}>Get App</h4>
            <div className="app-badges">
              <a href="#" className="app-badge">
                <div className="badge-content">
                  <span className="badge-small">Download on the</span>
                  <span className="badge-large">App Store</span>
                </div>
              </a>
              <a href="#" className="app-badge">
                <div className="badge-content">
                  <span className="badge-small">GET IT ON</span>
                  <span className="badge-large">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            {t('footer.copyright')}
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/refund-policy">Refunds</Link>
          </div>
          <div className="footer-payment-icons">
            <span title="Visa">💳</span>
            <span title="Mastercard">🏧</span>
            <span title="PayPal">🔵</span>
            <span title="Stripe">⚡</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
