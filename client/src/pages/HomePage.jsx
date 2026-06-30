import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import HeroBanner from '../components/home/HeroBanner';
import DealsSection from '../components/home/DealsSection';
import CategoryBanner from '../components/home/CategoryBanner';
import SupplierRequest from '../components/home/SupplierRequest';
import RecommendedItems from '../components/home/RecommendedItems';
import ExtraServices from '../components/home/ExtraServices';
import SuppliersByRegion from '../components/home/SuppliersByRegion';

const HomePage = () => {
  const { t } = useLanguage();

  // Automatically scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-wrapper">
      {/* 1. Category Sidebar, Hero Slider & Welcome panels */}
      <HeroBanner />

      {/* 2. Deals and countdown timer */}
      <DealsSection />

      {/* 3. Category Banner: Home and Outdoor */}
      <CategoryBanner
        title={t('home.homeAndOutdoor') || "Home and outdoor"}
        bgClass="home-bg"
        categoryName="Home & Kitchen"
        image="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=60"
      />

      {/* 4. Category Banner: Consumer Electronics */}
      <CategoryBanner
        title={t('home.consumerElectronics') || "Consumer electronics and gadgets"}
        bgClass="electronics-bg"
        categoryName="Electronics"
        image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=60"
      />

      {/* 5. Custom Inquiry Form */}
      <SupplierRequest />

      {/* 6. Grid of Product Recommendations */}
      <RecommendedItems />

      {/* 7. Extra Logistics & Trade Services */}
      <ExtraServices />

      {/* 8. Flag layout of Regional Suppliers */}
      <SuppliersByRegion />
    </div>
  );
};

export default HomePage;
