import React from 'react';
import { Link } from 'react-router';
import './Breadcrumb.css';

const Breadcrumb = ({ paths = [] }) => {
  return (
    <nav className="breadcrumb-nav">
      <div className="container breadcrumb-container">
        <Link to="/" className="breadcrumb-link">Home</Link>
        {paths.map((path, idx) => (
          <span key={idx} className="breadcrumb-item-wrapper">
            <span className="breadcrumb-separator">&gt;</span>
            {path.url ? (
              <Link to={path.url} className="breadcrumb-link">
                {path.label}
              </Link>
            ) : (
              <span className="breadcrumb-current">{path.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
