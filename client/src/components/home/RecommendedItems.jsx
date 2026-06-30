import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import * as productsAPI from '../../api/products';
import { formatPrice } from '../../utils/helpers';
import './RecommendedItems.css';

const RecommendedItems = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await productsAPI.getFeaturedProducts();
        setProducts(data.slice(0, 10));
      } catch (err) {
        console.error('Error fetching recommended:', err);
      }
    };
    fetchRecommended();
  }, []);

  // Fallback recommended items if database is empty/loading
  const fallbackRecommended = [
    {
      _id: '1',
      name: 'T-shirts with multiple colors, for men and lady',
      price: 10.30,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '2',
      name: 'Jeans jacket for men blue outer',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '3',
      name: 'Leather jacket dark brown premium',
      price: 99.00,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '4',
      name: 'Blue jeans denim for men casual',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '5',
      name: 'Leather wallet brown classic pocket size',
      price: 10.00,
      image: 'https://images.unsplash.com/photo-1627124765135-5652652a9a9b?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '6',
      name: 'Canon Camera EOS 2000D Black body',
      price: 998.00,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '7',
      name: 'GoPro HERO12 action waterproof video',
      price: 399.00,
      image: 'https://images.unsplash.com/photo-1565849210600-79f415057729?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '8',
      name: 'Headphones wireless noise cancel black',
      price: 348.00,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '9',
      name: 'Smart watch steel silver metal mesh strap',
      price: 89.50,
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '10',
      name: 'Electric kettle hot water heater safety auto',
      price: 33.00,
      image: 'https://images.unsplash.com/photo-1585338114002-96c5ac60f47e?w=200&auto=format&fit=crop&q=60'
    }
  ];

  const itemsToDisplay = products.length > 0 ? products : fallbackRecommended;

  return (
    <section className="recommended-section margin-top">
      <div className="container">
        <h3 className="recommended-title">{t('home.recommendedItems') || 'Recommended items'}</h3>
        <div className="recommended-grid">
          {itemsToDisplay.map((item) => {
            // Clean up the name string for the translation key
            const sanitizedKey = item.name.toLowerCase()
              .replace(/,/g, '')
              .replace(/ & /g, '_')
              .replace(/\s+/g, '_');
            const translationKey = `home.fallbackProducts.${sanitizedKey}`;
            const displayName = t(translationKey) !== translationKey ? t(translationKey) : item.name;

            return (
              <Link to={item._id.length <= 2 ? '/products' : `/products/${item._id}`} key={item._id} className="rec-item-card card">
                <div className="rec-img-wrapper">
                  <img src={item.image} alt={displayName} />
                </div>
                <div className="rec-info">
                  <p className="rec-price">{formatPrice(item.price)}</p>
                  <p className="rec-name">{displayName}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedItems;
