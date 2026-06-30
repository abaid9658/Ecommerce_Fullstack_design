import React from 'react';
import './StaticPages.css';

const RefundPolicyPage = () => (
  <div className="static-page">
    <section className="static-hero">
      <div className="static-hero-content">
        <span className="static-badge">Legal</span>
        <h1>Refund Policy</h1>
        <p>We want you to be completely satisfied with your purchase.</p>
      </div>
    </section>
    <section className="static-section">
      <div className="static-container">
        <div className="policy-content">
          <p className="policy-last-updated">Last updated: January 1, 2024</p>
          <h2>1. Return Window</h2>
          <p>You may return most items within 30 days of delivery for a full refund. Items must be in their original, unused condition with all tags and packaging intact.</p>
          <h2>2. Non-Returnable Items</h2>
          <ul>
            <li>Perishable goods (food, flowers)</li>
            <li>Downloadable software and digital products</li>
            <li>Intimate or sanitary goods</li>
            <li>Items marked as "Final Sale"</li>
            <li>Gift cards</li>
          </ul>
          <h2>3. Refund Process</h2>
          <p>Once we receive your return, we will inspect the item and notify you of the approval or rejection within 3 business days. If approved, refunds will be credited to your original payment method within 5–10 business days.</p>
          <h2>4. Late or Missing Refunds</h2>
          <p>If you haven't received a refund after 10 business days, first check your bank account, then contact your bank or credit card company as processing times vary. If you've done all this and still haven't received your refund, contact us at refunds@brand.com.</p>
          <h2>5. Damaged or Defective Items</h2>
          <p>If you received a damaged or defective item, contact us within 7 days of delivery with photos. We will arrange a free replacement or full refund at no cost to you.</p>
          <h2>6. Return Shipping</h2>
          <p>For standard returns, you are responsible for return shipping costs. For defective or wrong items, we will provide a prepaid return label.</p>
        </div>
      </div>
    </section>
  </div>
);

export default RefundPolicyPage;
