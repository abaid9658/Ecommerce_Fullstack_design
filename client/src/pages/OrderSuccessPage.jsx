import React from 'react';
import { Link } from 'react-router';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import './OrderResultPages.css';

const OrderSuccessPage = () => (
  <div className="order-result-page success">
    <div className="order-result-card">
      <div className="result-icon success-icon">
        <FiCheckCircle />
      </div>
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your purchase! Your order has been confirmed and will be processed shortly.</p>
      <div className="result-actions">
        <Link to="/profile" className="btn-primary">
          <FiPackage /> Track My Order
        </Link>
        <Link to="/products" className="btn-secondary">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    </div>
  </div>
);

export default OrderSuccessPage;
