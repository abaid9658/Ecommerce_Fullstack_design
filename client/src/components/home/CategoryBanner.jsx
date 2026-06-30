import React from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import './CategoryBanner.css';

const CategoryBanner = ({ title, bgClass, image, categoryName, items = [] }) => {
  const { t } = useLanguage();
  // Fallback items if none are loaded from database
  const fallbackItems = [
    { name: 'Soft chairs', price: '10', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&auto=format&fit=crop&q=60' },
    { name: 'Sofa & chair', price: '19', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=60' },
    { name: 'Kitchen dish', price: '10', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=120&auto=format&fit=crop&q=60' },
    { name: 'Smart watches', price: '90', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=120&auto=format&fit=crop&q=60' },
    { name: 'Kitchen mixer', price: '100', image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=120&auto=format&fit=crop&q=60' },
    { name: 'Blenders', price: '39', image: 'https://images.unsplash.com/photo-1585338114002-96c5ac60f47e?w=120&auto=format&fit=crop&q=60' },
    { name: 'Home appliance', price: '19', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&auto=format&fit=crop&q=60' },
    { name: 'Coffee maker', price: '10', image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=120&auto=format&fit=crop&q=60' }
  ];

  const renderItems = items.length > 0 ? items.slice(0, 8) : fallbackItems;

  return (
    <section className="category-banner-section margin-top">
      <div className="container category-banner-container card">
        {/* Left Side Banner */}
        <div className={`category-left-banner ${bgClass}`}>
          <div className="banner-content-wrapper">
            <h3 className="category-left-title">{title}</h3>
            <Link to={`/products?category=${encodeURIComponent(categoryName)}`} className="btn btn-secondary category-left-btn">
              {t('home.sourceNow') || 'Source now'}
            </Link>
          </div>
          <div className="category-left-img">
            <img src={image} alt={title} />
          </div>
        </div>

        {/* Right Side 2x4 Product Grid */}
        <div className="category-products-grid">
          {renderItems.map((item, idx) => {
            const translationKey = `home.fallbackProducts.${item.name.toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_')}`;
            const displayName = t(translationKey) !== translationKey ? t(translationKey) : item.name;
            return (
              <Link
                to={item._id ? `/products/${item._id}` : `/products?category=${encodeURIComponent(categoryName)}`}
                key={item._id || idx}
                className="cat-product-card"
              >
                <div className="cat-product-info">
                  <h5 className="cat-product-name">{displayName}</h5>
                  <p className="cat-product-price">{t('home.fromUSD') || 'From USD'} {item.price}</p>
                </div>
                <div className="cat-product-img-wrapper">
                  <img src={item.image} alt={displayName} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
