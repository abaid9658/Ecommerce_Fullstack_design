import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FiCheck, FiMail, FiShield, FiGlobe, FiArrowLeft, FiX } from 'react-icons/fi';
import * as productsAPI from '../api/products';
import { useLanguage } from '../context/LanguageContext';
import ProductGallery from '../components/products/ProductGallery';
import ProductInfo from '../components/products/ProductInfo';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductGridCard from '../components/products/ProductGridCard';
import { formatPrice } from '../utils/helpers';
import './ProductDetailsPage.css';


const ProductDetailsPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'specs', 'shipping'
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '', quantity: 1 });
  const [inquiryStatus, setInquiryStatus] = useState({ type: '', text: '' });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSendingInquiry(true);
    setInquiryStatus({ type: '', text: '' });
    try {
      await productsAPI.sendProductInquiry(product._id, inquiryForm);
      setInquiryStatus({ type: 'success', text: t('home.inquirySentSuccess') || 'Inquiry Sent Successfully!' });
      setTimeout(() => setShowInquiryModal(false), 2000);
    } catch (error) {
      setInquiryStatus({ type: 'error', text: 'Failed to send inquiry.' });
    } finally {
      setSendingInquiry(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prod = await productsAPI.getProductById(id);
        setProduct(prod);

        // Fetch related products
        const related = await productsAPI.getRelatedProducts(id);
        setRelatedProducts(related || []);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading-container">
        <h3>{t('common.loading') || 'Loading product details...'}</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-error-container container card margin-top">
        <h3>{t('common.noResults') || 'Product not found'}</h3>
        <p>{t('product.notFoundDesc') || 'The product you are looking for does not exist or has been removed.'}</p>
        <Link to="/products" className="btn btn-primary margin-top">
          <FiArrowLeft style={{ marginRight: '8px' }} /> {t('common.backToHome') || 'Back to products'}
        </Link>
      </div>
    );
  }

  const breadcrumbPaths = [
    { label: 'Products', url: '/products' },
    { label: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
    { label: product.brand || 'Detail' }
  ];

  return (
    <div className="product-details-page-wrapper">
      <Breadcrumb paths={breadcrumbPaths} />

      <div className="container details-layout-container">
        {/* Main Details Panel Card */}
        <div className="details-main-card card">
          <div className="details-card-grid">
            {/* Gallery Column */}
            <div className="details-gallery-col">
              <ProductGallery mainImage={product.image} images={product.images} />
            </div>

            {/* Info Column */}
            <div className="details-info-col">
              <ProductInfo product={product} />
            </div>

            {/* Supplier Sidebar Column */}
            <div className="details-supplier-col">
              <div className="supplier-card-inner">
                <div className="supplier-header">
                  <div className="supplier-avatar">
                    {product.supplier?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="supplier-info">
                    <h4>{product.supplier?.name || 'Global Distributor'}</h4>
                    <p className="supplier-sub">Verified Supplier</p>
                  </div>
                </div>

                <div className="supplier-meta-list">
                  <div className="supplier-meta-item">
                    <FiGlobe className="meta-icon" />
                    <span>{product.supplier?.country || 'China'}</span>
                  </div>
                  <div className="supplier-meta-item">
                    <FiShield className="meta-icon" />
                    <span>Verified License</span>
                  </div>
                  <div className="supplier-meta-item">
                    <FiCheck className="meta-icon" />
                    <span>Customizable Options</span>
                  </div>
                </div>

                <div className="supplier-actions">
                  <button className="btn btn-primary btn-block inquiry-btn" onClick={() => setShowInquiryModal(true)}>
                    <FiMail className="btn-icon" /> {t('home.sendInquiry') || 'Send inquiry'}
                  </button>
                  <button className="btn btn-secondary btn-block seller-profile-btn">
                    Seller's profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Tabs & Side Listing Layout */}
        <div className="details-tabs-sidebar-grid margin-top">
          {/* Left Tabs Info */}
          <div className="tabs-main-content card">
            <div className="tabs-navigation">
              <button
                className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Payment
              </button>
            </div>

            <div className="tab-pane-content">
              {activeTab === 'description' && (
                <div className="tab-pane-description">
                  <p>{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="feature-bullets margin-top">
                      <h4>Key Highlights</h4>
                      <ul>
                        {product.features.map((feat, idx) => (
                          <li key={idx}>
                            <FiCheck className="bullet-check" /> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="tab-pane-specs">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <th>Model</th>
                        <td>{product.specs?.model || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Style</th>
                        <td>{product.specs?.style || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Size</th>
                        <td>{product.specs?.size || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Certificate</th>
                        <td>{product.specs?.certificate || 'ISO-9001 CE'}</td>
                      </tr>
                      <tr>
                        <th>Memory / Capacity</th>
                        <td>{product.specs?.memory || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Condition</th>
                        <td>{product.condition || 'Brand new'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="tab-pane-shipping">
                  <p>
                    We offer multiple logistics partners to assure timely deliver of goods.
                    Typically, orders are processed and loaded within 3-5 business days from payment validation.
                  </p>
                  <table className="specs-table margin-top">
                    <tbody>
                      <tr>
                        <th>Shipping region</th>
                        <td>Global shipping supported</td>
                      </tr>
                      <tr>
                        <th>Logistics Partners</th>
                        <td>FedEx, DHL, UPS, Ocean Freight</td>
                      </tr>
                      <tr>
                        <th>Payment terms</th>
                        <td>Visa, MasterCard, PayPal, Stripe Checkout</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Similar Items Side Strip */}
          <div className="similar-items-sidebar card">
            <h3>You may also like</h3>
            <div className="similar-items-list">
              {relatedProducts.slice(0, 5).map((item) => (
                <Link to={`/products/${item._id}`} key={item._id} className="similar-item-card">
                  <div className="similar-img-wrapper">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="similar-info">
                    <h4>{item.name}</h4>
                    <p className="similar-price">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
              {relatedProducts.length === 0 && (
                <p className="text-muted">No similar products found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Bottom Row */}
        {relatedProducts.length > 0 && (
          <div className="related-products-row-wrapper margin-top">
            <h3 className="section-title">Related products</h3>
            <div className="related-products-grid">
              {relatedProducts.slice(0, 6).map((item) => (
                <ProductGridCard
                  key={item._id}
                  product={item}
                  isWishlisted={false}
                  onWishlistToggle={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('home.sendInquiry') || 'Send Inquiry'}</h2>
              <button className="close-btn" onClick={() => setShowInquiryModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleInquirySubmit} className="inquiry-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" min="1" value={inquiryForm.quantity} onChange={e => setInquiryForm({ ...inquiryForm, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="4" value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })} required placeholder={t('home.typeMoreDetails') || 'Type more details'}></textarea>
              </div>
              {inquiryStatus.text && (
                <div className={`form-message ${inquiryStatus.type}`}>{inquiryStatus.text}</div>
              )}
              <button type="submit" className="btn btn-primary btn-block" disabled={sendingInquiry}>
                {sendingInquiry ? 'Sending...' : (t('home.sendInquiry') || 'Send Inquiry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
