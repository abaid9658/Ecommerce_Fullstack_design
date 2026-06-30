import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './SupplierRequest.css';

const SupplierRequest = () => {
  const { t } = useLanguage();
  const [item, setItem] = useState('');
  const [details, setDetails] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('Pcs');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item && qty) {
      setSubmitted(true);
      setItem('');
      setDetails('');
      setQty('');
    }
  };

  return (
    <section className="supplier-request-section margin-top">
      <div className="container supplier-request-container">
        {/* Left Side Content */}
        <div className="request-info-wrapper">
          <h2 className="request-info-title">
            {t('home.easyWaySendRequests') || 'An easy way to send requests to all suppliers'}
          </h2>
          <p className="request-info-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Right Side Form */}
        <div className="request-form-card card">
          {submitted ? (
            <div className="request-submitted-msg">
              <h4>{t('home.inquirySentSuccess') || 'Inquiry Sent Successfully!'}</h4>
              <p>{t('home.suppliersContactSoon') || 'Suppliers will contact you shortly with custom quotes.'}</p>
              <button className="btn btn-primary margin-top" onClick={() => setSubmitted(false)}>
                {t('home.sendAnotherRequest') || 'Send Another Request'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="request-form">
              <h3 className="request-form-title">{t('home.sendQuoteToSuppliers') || 'Send quote to suppliers'}</h3>
              
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('home.whatItemNeed') || 'What item you need?'}
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  className="form-control text-area-details"
                  placeholder={t('home.typeMoreDetails') || 'Type more details'}
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group form-qty-input">
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('home.quantity') || 'Quantity'}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group form-unit-select">
                  <select
                    className="form-control"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Litres">Litres</option>
                    <option value="Tons">Tons</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary request-submit-btn">
                {t('home.sendInquiry') || 'Send inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupplierRequest;
