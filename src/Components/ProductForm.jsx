import React, { useState } from 'react';

function ProductForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    group: '',
    sku: '',
    productName: '',
    stockType1: '',
    stockType2: '',
    project: '',
    unit: '',
    cost: 0,
    retailPrice: 0,
    note: ''
  });

  // ✅ THÊM STATE ĐỂ NGĂN DOUBLE SUBMIT
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 [FORM] handleSubmit called');
    console.log('🔥 Timestamp:', Date.now());
    console.log('🔥 isSubmitting:', isSubmitting);
    console.log('🔥 SKU:', formData.sku);
    
    // Validate
    if (!formData.productName || !formData.sku) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    // ✅ NGĂN DOUBLE SUBMIT
    if (isSubmitting) {
      console.warn('⚠️ [FORM] BLOCKED - Already submitting');
      return;
    }

    setIsSubmitting(true);
    console.log('🔵 [FORM] Submit started');

    try {
      // ✅ AWAIT onSubmit vì nó là async function
      await onSubmit({
        ...formData,
        cost: Number(formData.cost),
        retailPrice: Number(formData.retailPrice)
      });

      console.log('✅ [FORM] Submit successful, resetting form');

      // Reset form sau khi thành công
      setFormData({ 
        group: '', 
        sku: '', 
        productName: '', 
        stockType1: '',
        stockType2: '',
        project: '',
        unit: '',
        cost: 0, 
        retailPrice: 0,
        note: ''
      });

      // ✅ GỌI onCancel để đóng form/modal (nếu có)
      if (onCancel) {
        onCancel();
      }

    } catch (error) {
      console.error('❌ [FORM] Submit error:', error);
      // Alert đã được xử lý ở Dashboard, không cần alert thêm ở đây
    } finally {
      // ✅ LUÔN RESET FLAG, dù thành công hay thất bại
      setIsSubmitting(false);
      console.log('🔴 [FORM] Submit finished');
    }
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="form-input"
            placeholder="Nhập tên sản phẩm"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phân loại kho</label>
          <input
            type="text"
            value={formData.stockType1}
            onChange={(e) => setFormData({ ...formData, stockType1: e.target.value })}
            className="form-input"
            placeholder="Nhập phân loại kho"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phân loại chi tiết</label>
          <input
            type="text"
            value={formData.stockType2}
            onChange={(e) => setFormData({ ...formData, stockType2: e.target.value })}
            className="form-input"
            placeholder="Nhập phân loại chi tiết"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Dự án</label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            className="form-input"
            placeholder="Nhập dự án"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Đơn vị</label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="form-input"
            placeholder="Nhập đơn vị"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Giá vốn (VNĐ)</label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="form-input"
            placeholder="0"
            min="0"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Ghi chú</label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="form-input"
            placeholder="Nhập ghi chú"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex">
        <button 
          type="button"
          className="btn-primary btn-success" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '⏳ Đang lưu...' : '💾 Lưu'}
        </button>
        <button 
          type="button"
          className="btn-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ❌ Hủy
        </button>
      </div>
    </div>
  );
}

export default ProductForm;