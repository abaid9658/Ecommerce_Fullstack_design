import React from 'react';
import { Link } from 'react-router';
import { FiUsers, FiTarget, FiAward, FiGlobe } from 'react-icons/fi';
import './StaticPages.css';

const STATS = [
  { icon: <FiUsers />, value: '10,000+', label: 'Happy Customers' },
  { icon: <FiTarget />, value: '50,000+', label: 'Products Delivered' },
  { icon: <FiAward />, value: '4.9/5', label: 'Customer Rating' },
  { icon: <FiGlobe />, value: '30+', label: 'Countries Served' },
];

const TEAM = [
  { name: 'Alex Johnson', role: 'CEO & Founder', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: 'Sarah Williams', role: 'Head of Design', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Michael Chen', role: 'CTO', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Emma Davis', role: 'Head of Operations', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
];

const AboutPage = () => (
  <div className="static-page">
    {/* Hero */}
    <section className="static-hero">
      <div className="static-hero-content">
        <span className="static-badge">Our Story</span>
        <h1>About Us</h1>
        <p>We are passionate about connecting people with the products they love. Since 2019, we have been dedicated to providing a premium shopping experience with quality products and exceptional customer service.</p>
      </div>
    </section>

    {/* Mission */}
    <section className="static-section">
      <div className="static-container">
        <div className="mission-grid">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>To make quality products accessible to everyone, everywhere. We believe great products should come with great experiences — from browsing to unboxing.</p>
            <p>Our platform connects thousands of trusted suppliers with millions of customers, creating a marketplace built on trust, transparency, and exceptional value.</p>
            <Link to="/products" className="static-cta-btn">Shop Now →</Link>
          </div>
          <div className="mission-image">
            <div className="mission-img-placeholder">
              🛒
              <span>Your Premier Marketplace</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="stats-section">
      <div className="static-container">
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="static-section">
      <div className="static-container">
        <h2 className="section-heading">Meet Our Team</h2>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="team-card">
              <img src={member.avatar} alt={member.name} className="team-avatar" />
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
