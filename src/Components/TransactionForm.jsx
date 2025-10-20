// components/TransactionForm.jsx
import React, { useState } from 'react';

function TransactionForm({ products, formData, onChange, onSubmit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    setSearchTerm(product.name);
    onChange({ ...formData, productId: product.id });
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value) {
      onChange({ ...formData, productId: '' });
    }
  };

  const selectedProduct = products.find(p => p.id === Number(formData.productId));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {formData.type === 'import' ? '📥 Nhập Kho' : '📤 Xuất Kho'}
        </h3>
      </div>

      <div className="form-group">
        <label className="form-label">Loại giao dịch</label>
        <select
          value={formData.type}
          onChange={(e) => onChange({ ...formData, type: e.target.value })}
        >
          <option value="import">Nhập kho</option>
          <option value="export">Xuất kho</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Sản phẩm</label>
        <div className="product-search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            className="form-input"
            placeholder="Nhập tên hoặc mã sản phẩm..."
          />
          
          {showSuggestions && searchTerm && filteredProducts.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="suggestion-info">
                    <strong>{product.name}</strong>
                    <span className="suggestion-sku">SKU: {product.sku}</span>
                  </div>
                  <span className="suggestion-stock">
                    Tồn: {product.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {selectedProduct && (
            <div className="selected-product-info">
              <span>✓ {selectedProduct.name}</span>
              <span className="text-muted"> - Tồn kho: {selectedProduct.quantity}</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Số lượng</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => onChange({ ...formData, quantity: e.target.value })}
          className="form-input"
          placeholder="Nhập số lượng"
          min="1"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Ghi chú</label>
        <textarea
          value={formData.note}
          onChange={(e) => onChange({ ...formData, note: e.target.value })}
          rows="3"
          placeholder="Nhập ghi chú..."
        />
      </div>

      <button className="btn-primary" onClick={onSubmit} style={{ width: '100%' }}>
        ✅ Xác nhận giao dịch
      </button>
    </div>
  );
}

export default TransactionForm;