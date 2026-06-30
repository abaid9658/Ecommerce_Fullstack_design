import React, { useState } from 'react';
import axios from '../api/axios';
import { FiSearch } from 'react-icons/fi';
import './StaticPages.css';

const TIMELINE_STEPS = [
  { label: 'Order Placed', key: 'pending' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Processing', key: 'processing' },
  { label: 'Shipped', key: 'shipped' },
  { label: 'Delivered', key: 'delivered' },
];

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await axios.get(`/orders/track/${orderId.trim()}`);
      setOrder(res.data.order);
    } catch {
      setError('Order not found. Please check the Order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? TIMELINE_STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <span className="static-badge">Order Tracking</span>
          <h1>Track Your Order</h1>
          <p>Enter your Order ID to get real-time updates on your shipment status.</p>
        </div>
      </section>

      <section className="static-section">
        <div className="static-container">
          <div className="track-order-section">
            <div className="track-form">
              <h3>Enter Order Details</h3>
              <div className="track-input-row">
                <input
                  type="text"
                  placeholder="Order ID (e.g. 6846ABC12345)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                />
                <button onClick={handleTrack} disabled={loading}>
                  {loading ? '...' : <><FiSearch /> Track</>}
                </button>
              </div>
              {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
            </div>

            {order && (
              <div className="track-result">
                <div className="track-result-header">
                  <span className="track-order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="track-order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Visual step progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={step.key} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                      <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%',
                        background: i <= currentStepIndex ? '#3b82f6' : '#334155',
                        margin: '0 auto 0.4rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', color: 'white', fontWeight: 700,
                        transition: 'all 0.3s'
                      }}>
                        {i < currentStepIndex ? '✓' : i + 1}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: i <= currentStepIndex ? '#93c5fd' : '#64748b', fontWeight: i <= currentStepIndex ? 600 : 400 }}>
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="tracking-timeline">
                  {order.trackingHistory?.map((event, i) => (
                    <div key={i} className="timeline-event">
                      <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
                      <div className="timeline-event-label">{event.status}</div>
                      <div className="timeline-event-time">{new Date(event.updatedAt).toLocaleString()}</div>
                      {event.note && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{event.note}</div>}
                    </div>
                  )) || (
                    <div className="timeline-event">
                      <div className="timeline-dot active" />
                      <div className="timeline-event-label">Order {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</div>
                      <div className="timeline-event-time">{new Date(order.updatedAt || order.createdAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackOrderPage;
