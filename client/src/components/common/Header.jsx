import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  FiUser, FiHeart, FiShoppingCart, FiMenu, FiChevronDown,
  FiSearch, FiX, FiMessageSquare, FiPackage, FiGlobe, FiLogOut,
  FiSettings, FiGrid
} from 'react-icons/fi';
import './Header.css';

const CATEGORIES = [
  'All Categories', 'Automobiles', 'Clothes & Wear', 'Home & Kitchen',
  'Consumer Electronics', 'Computer & Tech', 'Sports & Outdoor',
  'Animal & Pets', 'Machinery Tools', 'Books',
];

const NAV_LINKS = [
  { key: 'nav.hotOffers', label: 'Hot offers', path: '/products?tag=offers' },
  { key: 'nav.giftBoxes', label: 'Gift boxes', path: '/products?tag=gifts' },
  { key: 'nav.projects', label: 'Projects', path: '/about' },
  { key: 'nav.menuItem', label: 'Menu item', path: '/products' },
];
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
];

const Header = () => {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const { t, language, changeLanguage, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showShipTo, setShowShipTo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('shipToCountry');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return COUNTRIES[0];
  });


  const langRef = useRef(null);
  const userRef = useRef(null);
  const shipRef = useRef(null);
  const helpRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (shipRef.current && !shipRef.current.contains(e.target)) setShowShipTo(false);
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (searchCategory !== 'All Categories') params.set('category', searchCategory);
    navigate(`/products?${params.toString()}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setShowUser(false);
    navigate('/');
  };

  const currentLang = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <header className="hdr">
      {/* ===== TOP BAR (Logo + Search + Actions) ===== */}
      <div className="hdr-top">
        <div className="hdr-inner">
          {/* Logo */}
          <Link to="/" className="hdr-logo">
            <div className="hdr-logo-icon">
              <div className="logo-sq logo-sq1" />
              <div className="logo-sq logo-sq2" />
            </div>
            <span className="hdr-logo-text">Brand</span>
          </Link>

          {/* Search Form */}
          <form className="hdr-search" onSubmit={handleSearch}>
            <div className="hdr-search-cat">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="hdr-cat-select"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c === 'All Categories' ? t('nav.allCategories') : c}</option>
                ))}
              </select>
              <FiChevronDown className="hdr-cat-arrow" />
            </div>
            <input
              type="text"
              className="hdr-search-input"
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hdr-search-btn">
              <FiSearch />
              <span>Search</span>
            </button>
          </form>

          {/* Action Icons */}
          <div className="hdr-actions">
            {/* Profile */}
            <div className="hdr-action-item" ref={userRef}>
              <button className="hdr-action-btn" onClick={() => setShowUser(v => !v)}>
                <FiUser className="hdr-act-icon" />
                <span className="hdr-act-label">{user ? user.name.split(' ')[0] : t('nav.profile')}</span>
              </button>
              {showUser && (
                <div className="hdr-dropdown user-dropdown">
                  {user ? (
                    <>
                      <div className="hdr-drop-header">
                        <span className="hdr-drop-name">Hi, {user.name.split(' ')[0]}!</span>
                        <span className="hdr-drop-role">{user.role}</span>
                      </div>
                      <Link to="/profile" className="hdr-drop-item" onClick={() => setShowUser(false)}>
                        <FiUser /> {t('nav.profile')}
                      </Link>
                      <Link to="/profile" className="hdr-drop-item" onClick={() => setShowUser(false)}>
                        <FiPackage /> {t('nav.orders')}
                      </Link>
                      <Link to="/wishlist" className="hdr-drop-item" onClick={() => setShowUser(false)}>
                        <FiHeart /> {t('nav.wishlist')}
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="hdr-drop-item hdr-drop-admin" onClick={() => setShowUser(false)}>
                          <FiGrid /> Admin Dashboard
                        </Link>
                      )}
                      <div className="hdr-drop-divider" />
                      <button className="hdr-drop-item hdr-drop-logout" onClick={handleLogout}>
                        <FiLogOut /> {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="hdr-drop-item" onClick={() => setShowUser(false)}>
                        {t('auth.signIn')}
                      </Link>
                      <Link to="/register" className="hdr-drop-item" onClick={() => setShowUser(false)}>
                        {t('auth.signUp')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <Link to="/contact" className="hdr-action-item hdr-simple-action">
              <FiMessageSquare className="hdr-act-icon" />
              <span className="hdr-act-label">{t('nav.messages')}</span>
            </Link>

            {/* Orders */}
            <Link to="/profile" className="hdr-action-item hdr-simple-action">
              <FiPackage className="hdr-act-icon" />
              <span className="hdr-act-label">{t('nav.orders')}</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="hdr-action-item hdr-simple-action hdr-cart">
              <div className="hdr-cart-wrap">
                <FiShoppingCart className="hdr-act-icon" />
                {totals.itemCount > 0 && (
                  <span className="hdr-cart-badge">{totals.itemCount}</span>
                )}
              </div>
              <span className="hdr-act-label">{t('nav.cart')}</span>
            </Link>
          </div>

          {/* Hamburger (mobile) */}
          <button className="hdr-hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* ===== NAV BAR ===== */}
      <div className={`hdr-nav ${mobileOpen ? 'hdr-nav--open' : ''}`}>
        <div className="hdr-inner hdr-nav-inner">
          {/* Nav Links */}
          <nav className="hdr-nav-links">
            <button className="hdr-nav-all-cats" onClick={() => navigate('/products')}>
              <FiMenu style={{ marginRight: '0.5rem' }} />
              {t('nav.allCategories')}
            </button>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="hdr-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key) || link.label}
              </Link>
            ))}

            {/* Help Dropdown in nav links */}
            <div className="hdr-nav-item" ref={helpRef}>
              <button className="hdr-nav-btn" onClick={() => setShowHelp(v => !v)} style={{ borderLeft: 'none', padding: '0 14px' }}>
                <span>{t('nav.help') || 'Help'}</span>
                <FiChevronDown />
              </button>
              {showHelp && (
                <div className="hdr-dropdown help-dropdown" style={{ left: 0, right: 'auto' }}>
                  <Link to="/faq" className="hdr-drop-item" onClick={() => { setShowHelp(false); setMobileOpen(false); }}>
                    {t('nav.helpCenter') || 'Help Center'}
                  </Link>
                  <Link to="/contact" className="hdr-drop-item" onClick={() => { setShowHelp(false); setMobileOpen(false); }}>
                    {t('nav.contact') || 'Contact Us'}
                  </Link>
                  <Link to="/track-order" className="hdr-drop-item" onClick={() => { setShowHelp(false); setMobileOpen(false); }}>
                    {t('nav.trackOrder') || 'Track Order'}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Language + Ship To */}
          <div className="hdr-nav-right">
            {/* Language */}
            <div className="hdr-nav-item" ref={langRef}>
              <button className="hdr-nav-btn" onClick={() => setShowLang(v => !v)}>
                <span className="hdr-flag">{currentLang?.flag}</span>
                <span>{currentLang?.name}</span>
                <FiChevronDown />
              </button>
              {showLang && (
                <div className="hdr-dropdown lang-dropdown">
                  {supportedLanguages.map(lang => (
                    <button
                      key={lang.code}
                      className={`hdr-drop-item ${language === lang.code ? 'active' : ''}`}
                      onClick={() => { changeLanguage(lang.code); setShowLang(false); }}
                    >
                      <span className="hdr-flag">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && <span className="hdr-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ship To */}
            <div className="hdr-nav-item" ref={shipRef}>
              <button className="hdr-nav-btn" onClick={() => setShowShipTo(v => !v)}>
                <span className="hdr-flag">{selectedCountry.flag}</span>
                <span>{(t('nav.shipTo') || 'Ship to')} {selectedCountry.name}</span>
                <FiChevronDown />
              </button>
              {showShipTo && (
                <div className="hdr-dropdown">
                  {COUNTRIES.map(c => (
                    <button
                      key={c.code}
                      className={`hdr-drop-item ${selectedCountry.code === c.code ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCountry(c);
                        localStorage.setItem('shipToCountry', JSON.stringify(c));
                        setShowShipTo(false);
                      }}
                    >
                      <span className="hdr-flag">{c.flag}</span>
                      <span>{c.name}</span>
                      {selectedCountry.code === c.code && <span className="hdr-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Search + Auth links */}
        <div className="hdr-mobile-extras">
          <form className="hdr-mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="hdr-mobile-search-input"
            />
            <button type="submit" className="hdr-mobile-search-btn"><FiSearch /></button>
          </form>
          {!user && (
            <div className="hdr-mobile-auth">
              <Link to="/login" className="hdr-mobile-auth-btn primary" onClick={() => setMobileOpen(false)}>
                {t('auth.signIn')}
              </Link>
              <Link to="/register" className="hdr-mobile-auth-btn" onClick={() => setMobileOpen(false)}>
                {t('auth.signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
