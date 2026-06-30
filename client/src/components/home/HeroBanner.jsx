import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './HeroBanner.css';

const HeroBanner = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const categories = [
    { key: 'Automobiles', label: t('cat.automobiles') || 'Automobiles' },
    { key: 'Clothing', label: t('cat.clothes') || 'Clothes & Wear' },
    { key: 'Home & Kitchen', label: t('cat.homeInteriors') || 'Home & Kitchen' },
    { key: 'Electronics', label: t('cat.computers') || 'Computer & Tech' },
    { key: 'Tools', label: t('cat.tools') || 'Tools & Equipment' },
    { key: 'Sports', label: t('cat.sports') || 'Sports & Outdoor' },
    { key: 'Toys', label: t('cat.animals') || 'Toys & Pets' },
    { key: 'Books', label: t('cat.machinery') || 'Books & More' },
  ];

  return (
    <section className="hero-banner-section section-padding">
      <div className="container hero-grid">
        {/* Left Categories Sidebar */}
        <div className="hero-sidebar card">
          <ul className="hero-category-list">
            {categories.map((cat) => (
              <li key={cat.key}>
                <Link to={`/products?category=${encodeURIComponent(cat.key)}`}>
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" className="more-cat-link">
                {t('nav.allCategories') || 'More Categories'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Center Promotion Banner */}
        <div className="hero-promo-main">
          <div className="promo-overlay">
            <h3 className="promo-tag">{t('home.heroTitle') || 'Latest trending'}</h3>
            <h1 className="promo-title">{t('home.heroSubtitle') || 'Best deals'}</h1>
            <Link to="/products" className="btn btn-secondary promo-btn">
              {t('home.shopNow') || 'Shop Now'}
            </Link>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="hero-right-panels">
          {/* User Welcoming Card */}
          <div className="user-welcome-card card">
            <div className="user-info-row">
              <div className="user-avatar-placeholder">👤</div>
              <div className="user-welcome-text">
                <p>Hi, {user ? user.name.split(' ')[0] : 'User'}!</p>
                <p className="welcome-sub">Let's get started</p>
              </div>
            </div>
            {!user ? (
              <div className="welcome-actions">
                <Link to="/register" className="btn btn-primary welcome-btn-join">
                  {t('auth.signUp') || 'Join now'}
                </Link>
                <Link to="/login" className="btn btn-secondary welcome-btn-login">
                  {t('auth.signIn') || 'Log in'}
                </Link>
              </div>
            ) : (
              <div className="welcome-actions">
                <Link to="/profile" className="btn btn-primary welcome-btn-join">
                  {t('nav.orders') || 'My Orders'}
                </Link>
              </div>
            )}
          </div>

          {/* Mini Banners */}
          <div className="orange-promo-card">
            <p className="orange-promo-text">
              {t('home.promoOffer') || 'Get US $10 off with a new supplier'}
            </p>
          </div>
          <div className="teal-promo-card">
            <p className="teal-promo-text">
              {t('home.promoQuote') || 'Send quotes with supplier preferences'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
