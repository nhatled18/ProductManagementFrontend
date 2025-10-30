import React, { useState } from 'react';

function ProductInventoryForm({ onSubmit, onCancel, products }) {
  const [formData, setFormData] = useState({
    productId: '',
    stockType1: '',
    stockType2: '',
    retailPrice: 0,
    cost: 0,
    initialStock: 0,
    stockIn: 0,
    stockOut: 0,
    damaged: 0,
    endingStock: 0,
    note: ''
  });

  // Auto calculate ending stock
  const calculateEndingStock = (initial, stockIn, stockOut, damaged) => {
    return Number(initial) + Number(stockIn) - Number(stockOut) - Number(damaged);
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    // Auto calculate ending stock when relevant fields change
    if (['initialStock', 'stockIn', 'stockOut', 'damaged'].includes(field)) {
      newData.endingStock = calculateEndingStock(
        newData.initialStock,
        newData.stockIn,
        newData.stockOut,
        newData.damaged
      );
    }
    
    setFormData(newData);
  };

  const handleSubmit = () => {
    if (!formData.productId) {
      alert('Vui lòng chọn sản phẩm!');
      return;
    }
    
    onSubmit({
      ...formData,
      retailPrice: Number(formData.retailPrice),
      cost: Number(formData.cost),
      initialStock: Number(formData.initialStock),
      stockIn: Number(formData.stockIn),
      stockOut: Number(formData.stockOut),
      damaged: Number(formData.damaged),
      endingStock: Number(formData.endingStock)
    });
    
    setFormData({ 
      productId: '',
      stockType1: '',
      stockType2: '',
      retailPrice: 0,
      cost: 0,
      initialStock: 0,
      stockIn: 0,
      stockOut: 0,
      damaged: 0,
      endingStock: 0,
      note: ''
    });
  };

  return (
    <div className="form-box">
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
        Thêm tồn kho sản phẩm
      </h3>
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Chọn sản phẩm *</label>
          <select
            value={formData.productId}
            onChange={(e) => handleChange('productId', e.target.value)}
            className="form-input"
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.sku} - {product.productName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Phân loại kho</label>
          <input
            type="text"
            value={formData.stockType1}
            onChange={(e) => handleChange('stockType1', e.target.value)}
            className="form-input"
            placeholder="Nhập phân loại kho"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phân loại chi tiết</label>
          <input
            type="text"
            value={formData.stockType2}
            onChange={(e) => handleChange('stockType2', e.target.value)}
            className="form-input"
            placeholder="Nhập phân loại chi tiết"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Giá niêm yết (VNĐ)</label>
          <input
            type="number"
            value={formData.retailPrice}
            onChange={(e) => handleChange('retailPrice', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Giá vốn (VNĐ)</label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tồn kho đầu</label>
          <input
            type="number"
            value={formData.initialStock}
            onChange={(e) => handleChange('initialStock', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Trưng bày</label>
          <input
            type="number"
            value={formData.stockIn}
            onChange={(e) => handleChange('stockIn', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tổng nhập</label>
          <input
            type="number"
            value={formData.stockOut}
            onChange={(e) => handleChange('stockOut', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tổng xuất</label>
          <input
            type="number"
            value={formData.damaged}
            onChange={(e) => handleChange('damaged', e.target.value)}
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Hỏng/Lỗi</label>
          <input
            type="number"
            value={formData.damaged}
            onChange={(e) => handleChange('damaged', e.target.value)}
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
            readOnly
            className="form-input"
            placeholder="0"
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
          />
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Ghi chú</label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="form-input"
            placeholder="Nhập ghi chú"
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

export default ProductInventoryForm;