import React, { useState, useEffect } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ mainImage, images = [] }) => {
  const [activeImage, setActiveImage] = useState(mainImage);

  // Sync state if mainImage changes
  useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  const galleryImages = images.length > 0 ? images : [mainImage];

  return (
    <div className="product-gallery-wrapper">
      {/* Main Display Image */}
      <div className="gallery-main-display card">
        <img src={activeImage} alt="Product view" />
      </div>

      {/* Thumbnails list */}
      {galleryImages.length > 1 && (
        <div className="gallery-thumbnails-strip">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail-box card ${activeImage === img ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
