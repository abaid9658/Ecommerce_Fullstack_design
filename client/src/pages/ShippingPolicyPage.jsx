import React from 'react';
import './StaticPages.css';

const ShippingPolicyPage = () => (
  <div className="static-page">
    <section className="static-hero">
      <div className="static-hero-content">
        <span className="static-badge">Shipping</span>
        <h1>Shipping Policy</h1>
        <p>Everything you need to know about how we get your order to your door.</p>
      </div>
    </section>
    <section className="static-section">
      <div className="static-container">
        <div className="policy-content">
          <p className="policy-last-updated">Last updated: January 1, 2024</p>
          <h2>1. Processing Time</h2>
          <p>Orders are typically processed within 1–2 business days (Monday–Friday, excluding holidays). Orders placed on weekends or holidays will be processed on the next business day.</p>
          <h2>2. Shipping Options & Estimates</h2>
          <ul>
            <li><strong>Standard Shipping (Free over $50):</strong> 5–10 business days</li>
            <li><strong>Express Shipping ($9.99):</strong> 2–3 business days</li>
            <li><strong>Overnight Shipping ($19.99):</strong> Next business day</li>
            <li><strong>International Shipping ($24.99+):</strong> 10–20 business days</li>
          </ul>
          <h2>3. Tracking Your Order</h2>
          <p>Once your order ships, you'll receive a confirmation email with a tracking number. Use our Track Order page or visit the carrier's website to monitor your shipment.</p>
          <h2>4. International Shipping</h2>
          <p>We ship to 30+ countries. International orders may be subject to customs duties and taxes determined by your country's customs authority. These fees are the buyer's responsibility.</p>
          <h2>5. Undeliverable Packages</h2>
          <p>If a package is returned as undeliverable due to an incorrect address, we will contact you to arrange re-shipping. Additional shipping fees may apply.</p>
          <h2>6. Lost or Stolen Packages</h2>
          <p>If your tracking shows delivered but you haven't received your package, please check with neighbors and your local delivery facility. Contact us at shipping@brand.com if the issue persists.</p>
        </div>
      </div>
    </section>
  </div>
);

export default ShippingPolicyPage;
