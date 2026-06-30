import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import Breadcrumb from '../components/common/Breadcrumb';
import FilterSidebar from '../components/products/FilterSidebar';
import ViewToggle from '../components/products/ViewToggle';
import ActiveFilters from '../components/products/ActiveFilters';
import ProductGridCard from '../components/products/ProductGridCard';
import ProductListItem from '../components/products/ProductListItem';
import Pagination from '../components/products/Pagination';
import * as productsAPI from '../api/products';
import './ProductListingPage.css';

const ProductListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Extract query filters from URL search string
  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category') || '',
      brand: params.get('brand') || '',
      features: params.get('features') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      rating: params.get('rating') || '',
      condition: params.get('condition') || '',
      sort: params.get('sort') || 'featured',
      page: Number(params.get('page')) || 1,
      limit: Number(params.get('limit')) || 10,
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  // Sync state with URL changes
  useEffect(() => {
    setFilters(getFiltersFromURL());
  }, [location.search]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryFilters = { ...filters };
        if (verifiedOnly) {
          queryFilters.verified = 'true';
        }
        const data = await productsAPI.getProducts(queryFilters);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
    window.scrollTo(0, 0);
  }, [filters, verifiedOnly]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key] !== undefined && newFilters[key] !== null && newFilters[key] !== '') {
        params.append(key, newFilters[key]);
      }
    });
    navigate(`/products?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value, page: 1 }; // reset to page 1 on filter change
    setFilters(nextFilters);
    updateURL(nextFilters);
  };

  const handleRemoveFilter = (key, value) => {
    handleFilterChange(key, value);
  };

  const handleClearAllFilters = () => {
    const cleared = {
      search: '',
      category: '',
      brand: '',
      features: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      condition: '',
      sort: 'featured',
      page: 1,
      limit: 10,
    };
    setFilters(cleared);
    setVerifiedOnly(false);
    updateURL(cleared);
  };

  const handlePageChange = (pageNum) => {
    const nextFilters = { ...filters, page: pageNum };
    setFilters(nextFilters);
    updateURL(nextFilters);
  };

  const handleLimitChange = (limitNum) => {
    const nextFilters = { ...filters, limit: limitNum, page: 1 };
    setFilters(nextFilters);
    updateURL(nextFilters);
  };

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Breadcrumb structure
  const breadcrumbPaths = [
    { label: t('nav.shop') || 'Products', url: '/products' }
  ];
  if (filters.category) {
    breadcrumbPaths.push({ label: filters.category });
  }

  return (
    <div className="product-listing-page-wrapper">
      {/* Breadcrumbs */}
      <Breadcrumb paths={breadcrumbPaths} />

      <div className="container listing-layout-container">
        {/* Mobile filter toggle button */}
        <button
          className="mobile-filter-toggle-btn"
          onClick={() => setShowMobileFilters(prev => !prev)}
        >
          {showMobileFilters ? (t('common.hideFilters') || 'Hide Filters') : (t('common.showFilters') || 'Show Filters')}
        </button>

        {/* Left Filters Sidebar wrapped in a toggleable container */}
        <div className={`sidebar-wrapper ${showMobileFilters ? 'open' : ''}`}>
          <FilterSidebar activeFilters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Right Product Grid/List content */}
        <div className="listing-main-content">
          <ViewToggle
            totalCount={totalCount}
            category={filters.category}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortValue={filters.sort}
            onSortChange={(val) => handleFilterChange('sort', val)}
            verifiedOnly={verifiedOnly}
            onVerifiedToggle={setVerifiedOnly}
          />

          <ActiveFilters
            activeFilters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          {loading ? (
            <div className="listing-loading-placeholder">
              <h3>{t('common.loading') || 'Loading catalog...'}</h3>
            </div>
          ) : products.length === 0 ? (
            <div className="listing-empty-placeholder card">
              <h3>{t('common.noResults') || 'No products found matching filters'}</h3>
              <p className="margin-top">{t('common.tryAdjustingFilters') || 'Try adjusting price ranges, features, or search keywords.'}</p>
              <button className="btn btn-primary margin-top" onClick={handleClearAllFilters}>
                {t('common.clearAll') || 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className={`products-view-${viewMode}`}>
              {products.map((prod) =>
                viewMode === 'grid' ? (
                  <ProductGridCard
                    key={prod._id}
                    product={prod}
                    isWishlisted={wishlist.includes(prod._id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ) : (
                  <ProductListItem
                    key={prod._id}
                    product={prod}
                    isWishlisted={wishlist.includes(prod._id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                )
              )}
            </div>
          )}

          {/* Pagination bottom */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            limit={filters.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
