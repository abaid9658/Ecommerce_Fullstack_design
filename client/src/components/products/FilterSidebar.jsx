import React, { useState } from 'react';
import { CATEGORIES, BRANDS, CONDITIONS, FEATURES } from '../../utils/constants';
import { FiChevronUp, FiChevronDown, FiStar } from 'react-icons/fi';
import './FilterSidebar.css';

const FilterSidebar = ({ activeFilters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(activeFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice || '');

  // Toggle sections collapse
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    features: true,
    price: true,
    condition: true,
    rating: true
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (category) => {
    onFilterChange('category', category === 'All category' ? '' : category);
  };

  const handleBrandToggle = (brand) => {
    const currentBrands = activeFilters.brand ? activeFilters.brand.split(',') : [];
    let newBrands;
    if (currentBrands.includes(brand)) {
      newBrands = currentBrands.filter((b) => b !== brand);
    } else {
      newBrands = [...currentBrands, brand];
    }
    onFilterChange('brand', newBrands.join(','));
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = activeFilters.features ? activeFilters.features.split(',') : [];
    let newFeatures;
    if (currentFeatures.includes(feature)) {
      newFeatures = currentFeatures.filter((f) => f !== feature);
    } else {
      newFeatures = [...currentFeatures, feature];
    }
    onFilterChange('features', newFeatures.join(','));
  };

  const handleApplyPrice = (e) => {
    e.preventDefault();
    onFilterChange('minPrice', minPrice);
    onFilterChange('maxPrice', maxPrice);
  };

  const handleRatingSelect = (ratingVal) => {
    onFilterChange('rating', activeFilters.rating === String(ratingVal) ? '' : String(ratingVal));
  };

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          fill={i <= count ? 'var(--warning-color)' : 'none'}
          color={i <= count ? 'var(--warning-color)' : 'var(--text-muted)'}
          style={{ marginRight: '2px' }}
        />
      );
    }
    return stars;
  };

  return (
    <aside className="filter-sidebar">
      {/* 1. Category */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('category')}>
          <h4>Category</h4>
          {openSections.category ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.category && (
          <ul className="filter-list">
            {CATEGORIES.map((cat, idx) => (
              <li
                key={idx}
                className={`category-item ${
                  activeFilters.category === cat || (cat === 'All category' && !activeFilters.category) ? 'active' : ''
                }`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. Brands */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('brand')}>
          <h4>Brands</h4>
          {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.brand && (
          <div className="filter-checkbox-list">
            {BRANDS.map((brand, idx) => {
              const checked = activeFilters.brand ? activeFilters.brand.split(',').includes(brand) : false;
              return (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className="checkbox-text">{brand}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Features */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('features')}>
          <h4>Features</h4>
          {openSections.features ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.features && (
          <div className="filter-checkbox-list">
            {FEATURES.map((feat, idx) => {
              const checked = activeFilters.features ? activeFilters.features.split(',').includes(feat) : false;
              return (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleFeatureToggle(feat)}
                  />
                  <span className="checkbox-text">{feat}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Price range */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('price')}>
          <h4>Price range</h4>
          {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.price && (
          <form className="price-range-form" onSubmit={handleApplyPrice}>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary apply-price-btn">
              Apply
            </button>
          </form>
        )}
      </div>

      {/* 5. Condition */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('condition')}>
          <h4>Condition</h4>
          {openSections.condition ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.condition && (
          <div className="filter-radio-list">
            {CONDITIONS.map((cond, idx) => (
              <label key={idx} className="radio-label">
                <input
                  type="radio"
                  name="condition"
                  checked={
                    activeFilters.condition === cond || (cond === 'Any' && !activeFilters.condition)
                  }
                  onChange={() => onFilterChange('condition', cond === 'Any' ? '' : cond)}
                />
                <span className="radio-text">{cond}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Ratings */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('rating')}>
          <h4>Ratings</h4>
          {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.rating && (
          <div className="filter-ratings-list">
            {[5, 4, 3, 2, 1].map((starsCount) => {
              const active = activeFilters.rating === String(starsCount);
              return (
                <div
                  key={starsCount}
                  className={`rating-row-item ${active ? 'active' : ''}`}
                  onClick={() => handleRatingSelect(starsCount)}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={active}
                  />
                  <div className="stars-holder">{renderStars(starsCount)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
