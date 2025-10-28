import React, { useState } from 'react';

function ProductForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    group: '',
    sku: '',
    productName: '',
    quantity: 0,
    displayStock: 0,
    warehouseStock: 0,
    newStock: 0,
    soldStock: 0,
    damagedStock: 0,
    endingStock: 0,
    cost: 0,
    retailPrice: 0
  });

  const handleSubmit = () => {
    if (!formData.productName || !formData.sku) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      displayStock: Number(formData.displayStock),
      warehouseStock: Number(formData.warehouseStock),
      newStock: Number(formData.newStock),
      soldStock: Number(formData.soldStock),
      damagedStock: Number(formData.damagedStock),
      endingStock: Number(formData.endingStock),
      cost: Number(formData.cost),
      retailPrice: Number(formData.retailPrice)
    });
    setFormData({ 
      group: '', sku: '', productName: '', quantity: 0, displayStock: 0, 
      warehouseStock: 0, newStock: 0, soldStock: 0, damagedStock: 0, 
      endingStock: 0, cost: 0, retailPrice: 0 
    });
  };

  return (
    <div className="form-box">
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
        Thêm sản phẩm mới
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Nhóm</label>
          <input
            type="text"
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
            className="form-input"
            placeholder="Nhập nhóm sản phẩm"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mã SP (SKU)</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="form-input"
            placeholder="Nhập mã SKU"
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tên mặt hàng</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="form-input"
            placeholder="Nhập tên mặt hàng"
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
          <label className="form-label">Tồn kho bán</label>
          <input
            type="number"
            value={formData.warehouseStock}
            onChange={(e) => setFormData({ ...formData, warehouseStock: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tổng nhập mới</label>
          <input
            type="number"
            value={formData.newStock}
            onChange={(e) => setFormData({ ...formData, newStock: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tổng đã bán</label>
          <input
            type="number"
            value={formData.soldStock}
            onChange={(e) => setFormData({ ...formData, soldStock: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Hỏng mất</label>
          <input
            type="number"
            value={formData.damagedStock}
            onChange={(e) => setFormData({ ...formData, damagedStock: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tồn kho cuối</label>
          <input
            type="number"
            value={formData.endingStock}
            onChange={(e) => setFormData({ ...formData, endingStock: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Cost (VNĐ)</label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Giá niêm yết (VNĐ)</label>
          <input
            type="number"
            value={formData.retailPrice}
            onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
            className="form-input"
            placeholder="0"
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