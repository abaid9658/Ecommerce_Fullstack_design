import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi';
import './StaticPages.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: POST to /api/contact
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <span className="static-badge">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Have a question or need help? Our support team is here for you 24/7.</p>
        </div>
      </section>

      <section className="static-section">
        <div className="static-container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <h2>Let's Talk</h2>
              <p>We're always happy to hear from you. Whether it's a question about an order, a product, or just a general inquiry — we'd love to help.</p>

              {[
                { icon: <FiMail />, title: 'Email Support', detail: 'support@brand.com', sub: 'Reply within 24 hours' },
                { icon: <FiPhone />, title: 'Phone Support', detail: '+1 (800) 123-4567', sub: 'Mon–Fri, 9am–6pm EST' },
                { icon: <FiMapPin />, title: 'Headquarters', detail: '123 Commerce St, NY 10001', sub: 'United States' },
                { icon: <FiMessageCircle />, title: 'Live Chat', detail: 'Available in the app', sub: '24/7 automated + agent support' },
              ].map((item, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-item-icon">{item.icon}</div>
                  <div>
                    <div className="contact-item-title">{item.title}</div>
                    <div className="contact-item-detail">{item.detail}</div>
                    <div className="contact-item-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="contact-form-card">
              <h3>Send Us a Message</h3>
              {submitted && (
                <div className="contact-success">
                  ✓ Message sent! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="contact-field">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label>Message</label>
                  <textarea
                    rows="5"
                    placeholder="Describe your issue or question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="contact-submit-btn">
                  <FiSend /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
