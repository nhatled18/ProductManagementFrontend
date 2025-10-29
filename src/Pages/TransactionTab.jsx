import React, { useState } from 'react';
import ImportManagement from '../Components/ImportManagement';
import ExportManagement from '../Components/ExportManagement';

function TransactionTab({ 
  transactions = [], 
  products = [], 
  currentUser, 
  onTransactionComplete,
  type = 'import',
  defaultType = 'import'
}) {
  const transactionType = type || defaultType;
  const isImport = transactionType === 'import';
  const lastColumnTitle = isImport ? 'NGUỒN NHẬP' : 'LÝ DO XUẤT';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [rows, setRows] = useState([{
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    transactionCode: '',
    summary: '',
    createdBy: currentUser?.name || '',
    sku: '',
    productId: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    reason: '',
    note: ''
  }]);
  const [processing, setProcessing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [localTransactions, setLocalTransactions] = useState(transactions);

  // Sync với props khi transactions thay đổi
  React.useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const groups = ['all', ...new Set(products.map(p => p.group).filter(Boolean))];

  const filteredTransactions = localTransactions.filter(t => {
    const matchSearch = !searchTerm || 
      t.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = filterGroup === 'all' || t.group === filterGroup;
    return matchSearch && matchGroup;
  });

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

  // Tính toán thống kê
  const stats = {
    total: filteredTransactions.length,
    totalAmount: filteredTransactions.reduce((sum, t) => sum + (t.quantity * t.unitPrice || 0), 0),
    totalProducts: new Set(filteredTransactions.map(t => t.productId)).size,
    thisMonth: filteredTransactions.filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) alert(`Đã chọn file: ${file.name}\n(Chưa xử lý file - cần thư viện xlsx)`);
    };
    input.click();
  };

  const handleSubmitAll = async () => {
    const validRows = rows.filter(r => r.productName && r.quantity);
    if (validRows.length === 0) {
      alert('Không có dòng hợp lệ để xử lý!');
      return;
    }
    if (!window.confirm(`Xác nhận ${isImport ? 'nhập' : 'xuất'} ${validRows.length} sản phẩm?`)) return;

    setProcessing(true);
    try {
      // Tạo transactions mới
      const newTransactions = validRows.map(row => ({
        id: Date.now() + Math.random(), // Tạo ID tạm
        date: row.date,
        transactionCode: row.transactionCode,
        summary: row.summary,
        createdBy: row.createdBy,
        sku: row.sku,
        productId: row.productId,
        productName: row.productName,
        quantity: parseFloat(row.quantity),
        unitPrice: parseFloat(row.unitPrice),
        reason: row.reason,
        note: row.note,
        type: transactionType,
        createdAt: new Date().toISOString()
      }));

      // Thêm vào local state
      setLocalTransactions([...localTransactions, ...newTransactions]);

      // Gọi callback nếu có (để sync với server)
      if (onTransactionComplete) {
        await onTransactionComplete(newTransactions);
      }

      // Reset form
      setRows([{
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        transactionCode: '',
        summary: '',
        createdBy: currentUser?.name || '',
        sku: '',
        productId: '',
        productName: '',
        quantity: '',
        unitPrice: '',
        reason: '',
        note: ''
      }]);
      
      setShowImportModal(false);
      alert(`✅ ${isImport ? 'Nhập' : 'Xuất'} kho thành công ${newTransactions.length} sản phẩm!`);
    } catch (error) {
      console.error('Error submitting transactions:', error);
      alert('❌ Có lỗi xảy ra: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    if (!window.confirm('⚠️ Bạn có chắc muốn xóa giao dịch này?')) return;

    try {
      // Xóa khỏi local state
      setLocalTransactions(localTransactions.filter(t => t.id !== transactionId));
      alert('✅ Đã xóa giao dịch thành công!');

      // Gọi callback để sync với server (nếu cần)
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('❌ Có lỗi khi xóa: ' + error.message);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setRows([{
      id: transaction.id,
      date: transaction.date,
      transactionCode: transaction.transactionCode,
      summary: transaction.summary,
      createdBy: transaction.createdBy,
      sku: transaction.sku,
      productId: transaction.productId,
      productName: transaction.productName,
      quantity: transaction.quantity,
      unitPrice: transaction.unitPrice,
      reason: transaction.reason,
      note: transaction.note
    }]);
    setShowImportModal(true);
  };

  const handleSaveEditTransaction = async () => {
    if (!editingTransaction) return;
    
    const updatedRow = rows[0]; // Lấy row đầu tiên (vì edit chỉ có 1 row)
    
    if (!updatedRow.productName || !updatedRow.quantity) {
      alert('⚠️ Vui lòng điền đầy đủ tên sản phẩm và số lượng!');
      return;
    }

    if (!window.confirm('💾 Xác nhận lưu thay đổi?')) return;

    setProcessing(true);
    try {
      // Update transaction trong local state
      const updatedTransaction = {
        ...editingTransaction,
        date: updatedRow.date,
        transactionCode: updatedRow.transactionCode,
        summary: updatedRow.summary,
        createdBy: updatedRow.createdBy,
        sku: updatedRow.sku,
        productId: updatedRow.productId,
        productName: updatedRow.productName,
        quantity: parseFloat(updatedRow.quantity),
        unitPrice: parseFloat(updatedRow.unitPrice),
        reason: updatedRow.reason,
        note: updatedRow.note,
        updatedAt: new Date().toISOString()
      };

      setLocalTransactions(localTransactions.map(t => 
        t.id === editingTransaction.id ? updatedTransaction : t
      ));

      // Gọi callback để sync với server
      if (onTransactionComplete) {
        await onTransactionComplete();
      }

      // Reset form và đóng modal
      setShowImportModal(false);
      setEditingTransaction(null);
      setRows([{
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        transactionCode: '',
        summary: '',
        createdBy: currentUser?.name || '',
        sku: '',
        productId: '',
        productName: '',
        quantity: '',
        unitPrice: '',
        reason: '',
        note: ''
      }]);

      alert('✅ Đã cập nhật giao dịch thành công!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('❌ Có lỗi khi cập nhật: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteAllFiltered = () => {
    if (filteredTransactions.length === 0) {
      alert('⚠️ Không có giao dịch nào để xóa!');
      return;
    }

    if (!window.confirm(`⚠️ Bạn có chắc muốn xóa TẤT CẢ ${filteredTransactions.length} giao dịch đã lọc?`)) return;

    try {
      const filteredIds = filteredTransactions.map(t => t.id);
      setLocalTransactions(localTransactions.filter(t => !filteredIds.includes(t.id)));
      alert(`✅ Đã xóa ${filteredTransactions.length} giao dịch!`);

      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (error) {
      console.error('Error deleting all:', error);
      alert('❌ Có lỗi khi xóa: ' + error.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px'
    }}>
      {/* Header Section với Gradient */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: '700',
              background: isImport ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              {isImport ? '📦 Quản Lý Nhập Kho' : '📤 Quản Lý Xuất Kho'}
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
              Theo dõi và quản lý các giao dịch {isImport ? 'nhập' : 'xuất'} kho một cách dễ dàng
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={statsCardStyle}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Tổng giao dịch</div>
          </div>

          <div style={statsCardStyle}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: isImport ? '#10b981' : '#ef4444', marginBottom: '4px' }}>
              {formatCurrency(stats.totalAmount)}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Tổng giá trị</div>
          </div>

          <div style={statsCardStyle}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              {stats.totalProducts}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Loại sản phẩm</div>
          </div>

          <div style={statsCardStyle}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              {stats.thisMonth}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Tháng này</div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#9ca3af'
            }}>🔍</div>
            <input
              type="text"
              placeholder="Tìm kiếm mã phiếu, SKU, tên sản phẩm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                backgroundColor: '#f9fafb'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={filterGroup}
              onChange={e => setFilterGroup(e.target.value)}
              style={{
                padding: '14px 40px 14px 16px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                minWidth: '180px'
              }}
            >
              {groups.map(g => (
                <option key={g} value={g}>
                  {g === 'all' ? '🎯 Tất cả nhóm' : `📂 ${g}`}
                </option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '12px',
              color: '#6b7280'
            }}>▼</div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleDeleteAllFiltered}
            style={actionButtonStyle('#fee2e2', '#ef4444', '#fca5a5')}
          >
            <span style={{ fontSize: '18px' }}>🗑️</span>
            <span>Xóa ({filteredTransactions.length})</span>
          </button>

          <button onClick={handleImportExcel} style={actionButtonStyle('#dbeafe', '#3b82f6', '#93c5fd')}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <span>Import Excel</span>
          </button>

          <button 
            onClick={() => setShowImportModal(true)} 
            style={actionButtonStyle('#d1fae5', '#10b981', '#6ee7b7')}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            <span>{isImport ? 'Thêm Phiếu Nhập' : 'Thêm Phiếu Xuất'}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        <div style={{ overflow: 'auto', maxHeight: '65vh' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'sticky', 
                top: 0, 
                zIndex: 10 
              }}>
                <th style={modernHeaderStyle}>NGÀY</th>
                <th style={modernHeaderStyle}>MÃ PHIẾU {isImport ? 'NHẬP' : 'XUẤT'}</th>
                <th style={modernHeaderStyle}>TÓM TẮT</th>
                <th style={modernHeaderStyle}>NGƯỜI LẬP</th>
                <th style={modernHeaderStyle}>SKU</th>
                <th style={modernHeaderStyle}>TÊN SẢN PHẨM</th>
                <th style={modernHeaderStyle}>SL</th>
                <th style={modernHeaderStyle}>ĐƠN GIÁ</th>
                <th style={modernHeaderStyle}>THÀNH TIỀN</th>
                <th style={modernHeaderStyle}>{lastColumnTitle}</th>
                <th style={modernHeaderStyle}>GHI CHÚ</th>
                <th style={modernHeaderStyle}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    color: '#9ca3af'
                  }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📋</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Chưa có giao dịch
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Nhấn "{isImport ? 'Thêm Phiếu Nhập' : 'Thêm Phiếu Xuất'}" để bắt đầu
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, i) => (
                  <tr 
                    key={t.id || i}
                    style={{
                      backgroundColor: 'white',
                      transition: 'all 0.2s',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.transform = 'scale(1.005)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <td style={modernCellStyle}>{t.date || '-'}</td>
                    <td style={{...modernCellStyle, fontWeight: '600', color: '#667eea'}}>
                      {t.transactionCode || '-'}
                    </td>
                    <td style={modernCellStyle}>{t.summary || '-'}</td>
                    <td style={modernCellStyle}>{t.createdBy || '-'}</td>
                    <td style={{...modernCellStyle, fontFamily: 'monospace', fontWeight: '600'}}>
                      {t.sku}
                    </td>
                    <td style={modernCellStyle}>{t.productName}</td>
                    <td style={{...modernCellStyle, textAlign: 'center'}}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {t.quantity}
                      </span>
                    </td>
                    <td style={{...modernCellStyle, textAlign: 'right'}}>
                      {formatCurrency(t.unitPrice || 0)}
                    </td>
                    <td style={{...modernCellStyle, textAlign: 'right', fontWeight: '700'}}>
                      <span style={{ color: isImport ? '#10b981' : '#ef4444' }}>
                        {formatCurrency((t.quantity || 0) * (t.unitPrice || 0))}
                      </span>
                    </td>
                    <td style={modernCellStyle}>{t.reason || '-'}</td>
                    <td style={modernCellStyle}>{t.note || '-'}</td>
                    <td style={{...modernCellStyle, textAlign: 'center'}}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEditTransaction(t)}
                          style={miniButtonStyle('#dbeafe', '#3b82f6')}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleSaveTransaction(t.id)}
                          style={miniButtonStyle('#d1fae5', '#10b981')}
                        >
                          💾
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(t.id)}
                          style={miniButtonStyle('#fee2e2', '#ef4444')}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '1600px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {editingTransaction ? '✏️ Chỉnh Sửa Phiếu' : (isImport ? '📦 Thêm Phiếu Nhập Kho' : '📤 Thêm Phiếu Xuất Kho')}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                  {editingTransaction 
                    ? `Chỉnh sửa phiếu ${editingTransaction.transactionCode || '#' + editingTransaction.id}`
                    : `Nhập thông tin chi tiết các sản phẩm ${isImport ? 'nhập' : 'xuất'} kho`
                  }
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setEditingTransaction(null);
                  setRows([{
                    id: Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    transactionCode: '',
                    summary: '',
                    createdBy: currentUser?.name || '',
                    sku: '',
                    productId: '',
                    productName: '',
                    quantity: '',
                    unitPrice: '',
                    reason: '',
                    note: ''
                  }]);
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: 'white',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >×</button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {isImport ? (
                <ImportManagement
                  rows={rows}
                  setRows={setRows}
                  products={products}
                  type={transactionType}
                  currentUser={currentUser}
                  onSubmitAll={handleSubmitAll}
                  processing={processing}
                />
              ) : (
                <ExportManagement
                  rows={rows}
                  setRows={setRows}
                  products={products}
                  currentUser={currentUser}
                  onSubmitAll={handleSubmitAll}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Styles
const statsCardStyle = {
  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
  padding: '24px',
  borderRadius: '16px',
  border: '2px solid #f3f4f6',
  textAlign: 'center',
  transition: 'all 0.3s',
  cursor: 'pointer'
};

const actionButtonStyle = (bgColor, textColor, hoverBg) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 20px',
  backgroundColor: bgColor,
  color: textColor,
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'all 0.3s',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const modernHeaderStyle = {
  padding: '16px 12px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '700',
  color: 'white',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap'
};

const modernCellStyle = {
  padding: '16px 12px',
  fontSize: '14px',
  color: '#374151',
  verticalAlign: 'middle'
};

const miniButtonStyle = (bgColor, hoverColor) => ({
  padding: '8px',
  backgroundColor: bgColor,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '32px',
  height: '32px'
});

export default TransactionTab;