import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedProduct } from '../../hooks/useLocalization';
import * as productsAPI from '../../api/products';
import './DealsSection.css';

const DealsSection = () => {
  const { t } = useLanguage();
  const { localizeProduct } = useLocalizedProduct();
  const [dealProducts, setDealProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 34,
    seconds: 56
  });

  // Fetch deal products on mount
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await productsAPI.getDealProducts();
        setDealProducts(data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching deals:', err);
      }
    };
    fetchDeals();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const totalSecs =
          prevTime.days * 86400 +
          prevTime.hours * 3600 +
          prevTime.minutes * 60 +
          prevTime.seconds - 1;

        if (totalSecs <= 0) {
          clearInterval(interval);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const d = Math.floor(totalSecs / 86400);
        const h = Math.floor((totalSecs % 86400) / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;

        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  // Fallback products if database loading/empty
  const fallbackDeals = [
    {
      _id: '1',
      name: 'Smart watches',
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '2',
      name: 'Laptops',
      discount: '-15%',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '3',
      name: 'GoPro cameras',
      discount: '-20%',
      image: 'https://images.unsplash.com/photo-1565849210600-79f415057729?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '4',
      name: 'Headphones',
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60'
    },
    {
      _id: '5',
      name: 'Canon cameras',
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=60'
    }
  ];

  const displayedDeals = dealProducts.length > 0
    ? dealProducts.map(p => ({
        _id: p._id,
        name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
        discount: p.dealDiscount ? `-${p.dealDiscount}%` : '-20%',
        image: p.image
      }))
    : fallbackDeals;

  return (
    <section className="deals-section margin-top">
      <div className="container deals-container card">
        {/* Left Timer panel */}
        <div className="deals-timer-panel">
          <div>
            <h3 className="deals-title">{t('extra.dealsAndOffers') || 'Deals and offers'}</h3>
            <p className="deals-subtitle">{t('extra.hygieneEquipments') || 'Hygiene equipment'}</p>
          </div>
          <div className="countdown-timer">
            <div className="countdown-box">
              <span className="countdown-num">{formatNumber(timeLeft.days)}</span>
              <span className="countdown-label">{t('home.days') || 'Days'}</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-num">{formatNumber(timeLeft.hours)}</span>
              <span className="countdown-label">{t('home.hours') || 'Hours'}</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-num">{formatNumber(timeLeft.minutes)}</span>
              <span className="countdown-label">{t('home.mins') || 'Mins'}</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-num">{formatNumber(timeLeft.seconds)}</span>
              <span className="countdown-label">{t('home.secs') || 'Secs'}</span>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="deals-products-grid">
          {displayedDeals.map((deal) => {
            const localizedDeal = localizeProduct({ name: deal.name });
            return (
              <Link to={deal._id === '1' || deal._id === '2' || deal._id === '3' || deal._id === '4' || deal._id === '5' ? `/products` : `/products/${deal._id}`} key={deal._id} className="deal-product-card">
                <div className="deal-img-wrapper">
                  <img src={deal.image} alt={localizedDeal.name} />
                </div>
                <h5 className="deal-product-name">{localizedDeal.name}</h5>
                <span className="badge badge-discount deal-discount-badge">{deal.discount}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
