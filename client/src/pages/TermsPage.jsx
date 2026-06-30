import React from 'react';
import './StaticPages.css';

const TermsPage = () => (
  <div className="static-page">
    <section className="static-hero">
      <div className="static-hero-content">
        <span className="static-badge">Legal</span>
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using our platform.</p>
      </div>
    </section>
    <section className="static-section">
      <div className="static-container">
        <div className="policy-content">
          <p className="policy-last-updated">Last updated: January 1, 2024</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using our platform, you agree to be bound by these Terms of Service. If you do not agree to all terms, please do not use our services.</p>
          <h2>2. Account Responsibilities</h2>
          <ul>
            <li>You must be 18 years or older to create an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must not share your login credentials</li>
            <li>You must provide accurate and truthful information</li>
          </ul>
          <h2>3. Products and Pricing</h2>
          <p>We reserve the right to modify product availability and pricing at any time. Prices are in USD unless otherwise specified. We are not responsible for typographical errors in pricing.</p>
          <h2>4. Order Acceptance</h2>
          <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion, including cases of suspected fraud or pricing errors.</p>
          <h2>5. Intellectual Property</h2>
          <p>All content on this platform — including text, images, logos, and code — is owned by Brand Co. and protected by copyright laws. Reproduction without permission is prohibited.</p>
          <h2>6. Limitation of Liability</h2>
          <p>Brand Co. shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use our platform or products.</p>
          <h2>7. Governing Law</h2>
          <p>These terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles.</p>
        </div>
      </div>
    </section>
  </div>
);

export default TermsPage;
