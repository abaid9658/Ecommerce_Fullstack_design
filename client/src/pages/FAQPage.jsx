import React, { useState } from 'react';
import './StaticPages.css';

const FAQ_DATA = [
  {
    category: 'Orders',
    questions: [
      { q: 'How do I track my order?', a: 'You can track your order from the "Track Order" page using your Order ID sent to your email after purchase.' },
      { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled within 2 hours of placement. After that, cancellations depend on the shipping status. Contact support immediately.' },
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5–10 business days. Express shipping (1–3 days) is available at checkout for an additional fee.' },
    ],
  },
  {
    category: 'Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unused, in original packaging, and accompanied by a receipt.' },
      { q: 'How do I start a return?', a: 'Go to your Profile → My Orders, select the order, and click "Return/Refund". Our team will arrange a pickup.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 3–5 business days after we receive the returned item.' },
    ],
  },
  {
    category: 'Payment',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (via Stripe), PayPal, cash on delivery, and bank transfers.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through Stripe\'s PCI-DSS compliant infrastructure. We never store your card details.' },
      { q: 'Can I use multiple coupons?', a: 'Currently, only one coupon can be applied per order. Choose the one offering the highest discount.' },
    ],
  },
  {
    category: 'Account',
    questions: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" in the top navigation and fill in your details. Verification is done via email OTP.' },
      { q: 'How do I change my password?', a: 'Go to Profile → Account Settings → Change Password. You\'ll need to enter your current password to set a new one.' },
      { q: 'Can I have multiple shipping addresses?', a: 'Yes. You can save multiple shipping addresses in Profile → Addresses and select one at checkout.' },
    ],
  },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('Orders');
  const [openIndex, setOpenIndex] = useState(null);

  const activeFAQs = FAQ_DATA.find(d => d.category === activeCategory)?.questions || [];

  return (
    <div className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <span className="static-badge">Help Center</span>
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers to the most common questions about shopping, orders, returns, and your account.</p>
        </div>
      </section>

      <section className="static-section">
        <div className="static-container">
          <div className="faq-categories">
            {FAQ_DATA.map(d => (
              <button
                key={d.category}
                className={`faq-category-btn ${activeCategory === d.category ? 'active' : ''}`}
                onClick={() => { setActiveCategory(d.category); setOpenIndex(null); }}
              >
                {d.category}
              </button>
            ))}
          </div>

          <div className="faq-list">
            {activeFAQs.map((item, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                {openIndex === i && (
                  <div className="faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
