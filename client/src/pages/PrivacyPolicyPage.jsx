import React from 'react';
import './StaticPages.css';

const PrivacyPolicyPage = () => (
  <div className="static-page">
    <section className="static-hero">
      <div className="static-hero-content">
        <span className="static-badge">Legal</span>
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your personal information.</p>
      </div>
    </section>
    <section className="static-section">
      <div className="static-container">
        <div className="policy-content">
          <p className="policy-last-updated">Last updated: January 1, 2024</p>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including name, email address, shipping address, and payment information. We also collect usage data such as browsing history on our platform, device information, and IP addresses.</p>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your account and orders</li>
            <li>To send promotional emails (with your consent)</li>
            <li>To improve our platform and services</li>
            <li>To prevent fraud and ensure security</li>
          </ul>
          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our platform, provided they agree to keep it confidential.</p>
          <h2>4. Data Security</h2>
          <p>We implement industry-standard encryption (TLS/SSL) and security practices to protect your data. Payments are processed through PCI-DSS compliant Stripe. We never store full credit card numbers.</p>
          <h2>5. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser settings.</p>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@brand.com to exercise these rights.</p>
          <h2>7. Contact Us</h2>
          <p>For privacy-related inquiries, contact our Data Protection Officer at: privacy@brand.com</p>
        </div>
      </div>
    </section>
  </div>
);

export default PrivacyPolicyPage;
