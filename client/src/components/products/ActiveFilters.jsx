import React from 'react';
import { FiX } from 'react-icons/fi';
import './ActiveFilters.css';

const ActiveFilters = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const getFilterChips = () => {
    const chips = [];

    if (activeFilters.category) {
      chips.push({ key: 'category', label: activeFilters.category, value: '' });
    }

    if (activeFilters.brand) {
      activeFilters.brand.split(',').forEach((b) => {
        if (b) chips.push({ key: 'brand', label: b, value: b });
      });
    }

    if (activeFilters.features) {
      activeFilters.features.split(',').forEach((f) => {
        if (f) chips.push({ key: 'features', label: f, value: f });
      });
    }

    if (activeFilters.minPrice || activeFilters.maxPrice) {
      if (activeFilters.minPrice && activeFilters.maxPrice) {
        chips.push({
          key: 'price',
          label: `$${activeFilters.minPrice} - $${activeFilters.maxPrice}`,
          value: 'both'
        });
      } else if (activeFilters.minPrice) {
        chips.push({ key: 'minPrice', label: `>= $${activeFilters.minPrice}`, value: '' });
      } else if (activeFilters.maxPrice) {
        chips.push({ key: 'maxPrice', label: `<= $${activeFilters.maxPrice}`, value: '' });
      }
    }

    if (activeFilters.condition) {
      chips.push({ key: 'condition', label: activeFilters.condition, value: '' });
    }

    if (activeFilters.rating) {
      chips.push({ key: 'rating', label: `${activeFilters.rating} Stars & Up`, value: '' });
    }

    return chips;
  };

  const chips = getFilterChips();

  if (chips.length === 0) return null;

  const handleChipRemove = (chip) => {
    if (chip.key === 'brand') {
      const remainingBrands = activeFilters.brand
        .split(',')
        .filter((b) => b !== chip.value)
        .join(',');
      onRemoveFilter('brand', remainingBrands);
    } else if (chip.key === 'features') {
      const remainingFeatures = activeFilters.features
        .split(',')
        .filter((f) => f !== chip.value)
        .join(',');
      onRemoveFilter('features', remainingFeatures);
    } else if (chip.key === 'price') {
      onRemoveFilter('minPrice', '');
      onRemoveFilter('maxPrice', '');
    } else {
      onRemoveFilter(chip.key, '');
    }
  };

  return (
    <div className="active-filters-chips-bar">
      <div className="chips-list">
        {chips.map((chip, idx) => (
          <span key={idx} className="filter-chip">
            <span className="chip-label-text">{chip.label}</span>
            <button className="chip-remove-btn" onClick={() => handleChipRemove(chip)}>
              <FiX />
            </button>
          </span>
        ))}
        <button className="clear-all-filters-btn" onClick={onClearAll}>
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default ActiveFilters;
