import React from 'react';

const PropertyGallery = ({ images }) => {
  return (
    <section style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Property Gallery</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px'
      }}>
        {images.map((img, index) => (
          <div key={index} style={{ overflow: 'hidden', borderRadius: '12px', height: '200px' }}>
            <img 
              src={img.url} 
              alt={`Property view ${index}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyGallery;