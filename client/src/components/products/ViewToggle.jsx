import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import './ViewToggle.css';

const ViewToggle = ({
  totalCount,
  category,
  viewMode,
  onViewModeChange,
  sortValue,
  onSortChange,
  verifiedOnly,
  onVerifiedToggle
}) => {
  return (
    <div className="view-toggle-toolbar card">
      {/* Left Item Count */}
      <div className="toolbar-left">
        <span className="total-items-count">
          <strong>{totalCount || 0}</strong> items in <strong>{category || 'All catalog'}</strong>
        </span>
      </div>

      {/* Right Controls */}
      <div className="toolbar-right">
        {/* Verified checkbox */}
        <label className="verified-checkbox-label">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedToggle(e.target.checked)}
          />
          <span className="checkbox-custom-text">Verified only</span>
        </label>

        {/* Sort Select */}
        <div className="sort-select-wrapper">
          <select
            className="form-control sort-select-input"
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Popular</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Grid / List Toggles */}
        <div className="view-mode-buttons">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <FiGrid />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <FiList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
