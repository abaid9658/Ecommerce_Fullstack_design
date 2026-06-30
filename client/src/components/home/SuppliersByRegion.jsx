import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './SuppliersByRegion.css';

const SuppliersByRegion = () => {
  const { t } = useLanguage();

  const regions = [
    { name: 'Arabic Emirates', key: 'ae', flag: '🇦🇪', url: 'shopname.ae' },
    { name: 'Australia', key: 'au', flag: '🇦🇺', url: 'shopname.au' },
    { name: 'United States', key: 'us', flag: '🇺🇸', url: 'shopname.us' },
    { name: 'Russia', key: 'ru', flag: '🇷🇺', url: 'shopname.ru' },
    { name: 'Italy', key: 'it', flag: '🇮🇹', url: 'shopname.it' },
    { name: 'Denmark', key: 'dk', flag: '🇩🇰', url: 'shopname.dk' },
    { name: 'France', key: 'fr', flag: '🇫🇷', url: 'shopname.fr' },
    { name: 'China', key: 'cn', flag: '🇨🇳', url: 'shopname.cn' },
    { name: 'Great Britain', key: 'gb', flag: '🇬🇧', url: 'shopname.co.uk' },
    { name: 'Germany', key: 'de', flag: '🇩🇪', url: 'shopname.de' }
  ];

  return (
    <section className="region-suppliers-section section-padding">
      <div className="container">
        <h3 className="region-title">{t('home.suppliersByRegion') || 'Suppliers by region'}</h3>
        <div className="regions-grid">
          {regions.map((reg, idx) => {
            const displayName = t(`home.regionsList.${reg.key}`) || reg.name;
            return (
              <div key={idx} className="region-item">
                <span className="region-flag">{reg.flag}</span>
                <div className="region-text">
                  <span className="region-name">{displayName}</span>
                  <span className="region-url">{reg.url}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuppliersByRegion;
