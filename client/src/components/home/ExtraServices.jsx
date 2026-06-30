import React from 'react';
import { FiSearch, FiShield, FiSend, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './ExtraServices.css';

const ExtraServices = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t('home.servicesList.industryHubs') || 'Source from Industry Hubs',
      icon: <FiSearch />,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=60'
    },
    {
      title: t('home.servicesList.customizeProducts') || 'Customize Your Products',
      icon: <FiFileText />,
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=300&auto=format&fit=crop&q=60'
    },
    {
      title: t('home.servicesList.fastShipping') || 'Fast, reliable shipping by ocean or air',
      icon: <FiSend />,
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=300&auto=format&fit=crop&q=60'
    },
    {
      title: t('home.servicesList.monitoringInspection') || 'Product monitoring and inspection',
      icon: <FiShield />,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <section className="services-section margin-top">
      <div className="container">
        <h3 className="services-title">{t('home.ourExtraServices') || 'Our extra services'}</h3>
        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="service-card card">
              <div className="service-img-wrapper">
                <img src={service.image} alt={service.title} />
                <div className="service-icon-badge">{service.icon}</div>
              </div>
              <div className="service-info-box">
                <h5 className="service-card-title">{service.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraServices;
