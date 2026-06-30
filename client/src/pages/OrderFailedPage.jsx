import React from 'react';
import { Link } from 'react-router';
import { FiXCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import './OrderResultPages.css';

const OrderFailedPage = () => (
  <div className="order-result-page failed">
    <div className="order-result-card">
      <div className="result-icon failed-icon">
        <FiXCircle />
      </div>
      <h1>Payment Failed</h1>
      <p>Something went wrong with your payment. Please try again or choose a different payment method.</p>
      <div className="result-actions">
        <Link to="/checkout" className="btn-retry">
          <FiRefreshCw /> Try Again
        </Link>
        <Link to="/" className="btn-secondary">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default OrderFailedPage;
