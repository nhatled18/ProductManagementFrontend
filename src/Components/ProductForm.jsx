// components/ProductForm.jsx
import React, { useState } from 'react';

function ProductForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: '',
    minStock: 5
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.sku || formData.price <= 0) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      minStock: Number(formData.minStock)
    });
    setFormData({ name: '', sku: '', quantity: 0, price: 0, category: '', minStock: 5 });
  };

  return (
    <div className="form-box">
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
        Thêm sản phẩm mới
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mã SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="form-input"
            placeholder="Nhập mã SKU"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Giá (VNĐ)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Danh mục</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
            placeholder="Nhập danh mục"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tồn kho tối thiểu</label>
          <input
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            className="form-input"
            placeholder="5"
            min="0"
          />
        </div>
      </div>
      <div className="flex">
        <button className="btn-primary btn-success" onClick={handleSubmit}>
          💾 Lưu
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          ❌ Hủy
        </button>
      </div>
    </div>
  );
}

export default ProductForm;