import { useState } from 'react';
import "../assets/styles/ProductDisplay.css";

function ProductDisplay({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.group).filter(Boolean))];

  const filteredProducts = products
    .filter(p => {
      const name = p.productName || "";
      const sku = p.sku || "";
      const group = p.group || "";
      const term = searchTerm?.toLowerCase() || "";

      return (
        (selectedCategory === 'all' || group === selectedCategory) &&
        (name.toLowerCase().includes(term) || sku.toLowerCase().includes(term))
      );
    })
    .filter(p => p.quantity > 0);

  // Random colors for product cards
  const cardColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];

  return (
    <div className="showroom-premium">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="showroom-content">
        {/* Modern Header */}
        <div className="premium-header">
          <div className="header-content">
            <div className="header-badge">✨ Premium Collection</div>
            <h1 className="premium-title">Trưng Bày</h1>
            <p className="premium-subtitle">
              Khám phá những sản phẩm của chúng tôi
            </p>
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, mã SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-section">
          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="pill-icon">
                  {cat === 'all' ? '🎯' : '📦'}
                </span>
                <span className="pill-text">
                  {cat === 'all' ? 'Tất cả' : cat}
                </span>
                <span className="pill-count">
                  {cat === 'all' 
                    ? products.filter(p => p.quantity > 0).length 
                    : products.filter(p => p.group === cat && p.quantity > 0).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-showcase">
          {filteredProducts.length === 0 ? (
            <div className="empty-showcase">
              <div className="empty-icon">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={product.id} className="product-showcase-card">
                {/* Product Image with Gradient */}
                <div 
                  className="product-image-modern"
                  style={{ background: cardColors[index % cardColors.length] }}
                >
                  <div className="image-overlay"></div>
                  <div className="product-icon">
                    📦
                  </div>
                  {product.quantity <= 10 && (
                    <div className="limited-badge">
                      🔥 Số lượng có hạn
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="product-info-modern">
                  <div className="product-category-badge">
                    {product.group || 'Chưa phân loại'}
                  </div>
                  
                  <h3 className="product-name-modern">{product.productName}</h3>
                  
                  <div className="product-meta">
                    <span className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      SKU: {product.sku}
                    </span>
                    {product.quantity <= 10 && (
                      <span className="meta-stock">
                        Còn {product.quantity}
                      </span>
                    )}
                  </div>

                  <div className="price-section-modern">
                    <div className="price-main">
                      {product.retailPrice.toLocaleString('vi-VN')}₫
                    </div>
                    {product.cost > 0 && product.cost !== product.retailPrice && (
                      <div className="price-cost">
                        Cost: {product.cost.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                  </div>

                  <button className="cta-button">
                    <span>Xem chi tiết</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Result Count */}
        {filteredProducts.length > 0 && (
          <div className="result-info">
            <span className="result-text">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDisplay;