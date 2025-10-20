// components/LowStockAlert.jsx
import React from 'react';

function LowStockAlert({ products }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">⚠️ Sản Phẩm Hết Hàng</h3>
      </div>
      <div>
        {products.map(product => (
          <div key={product.id} className="alert alert-warning">
            <div style={{ flex: 1 }}>
              <strong>{product.name}</strong><br />
              <small>SKU: {product.sku}</small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ color: '#dc2626', fontSize: '16px' }}>
                Còn {product.quantity}
              </strong><br />
              <small style={{ color: '#6b7280' }}>Tối thiểu: {product.minStock}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LowStockAlert;