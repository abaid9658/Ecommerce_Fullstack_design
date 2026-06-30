import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container newsletter-inner">
        <h3 className="newsletter-title">Subscribe on our newsletter</h3>
        <p className="newsletter-subtitle">
          Get daily news on upcoming offers from many suppliers all over the world
        </p>

        {subscribed ? (
          <div className="subscribed-success">
            Thank you for subscribing to our newsletter!
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-wrapper">
              <FiMail className="mail-icon" />
              <input
                type="email"
                className="newsletter-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary newsletter-btn">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
