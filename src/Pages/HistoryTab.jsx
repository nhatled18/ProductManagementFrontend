import React from 'react';
import "../assets/styles/Common.css";
function HistoryTab({ historyLogs, currentUser }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionLabel = (action) => {
    switch(action) {
      case 'add': return 'Thêm sản phẩm';
      case 'update': return ' Cập nhật sản phẩm';
      case 'delete': return 'Xóa sản phẩm';
      case 'import': return 'Nhập kho';
      case 'export': return 'Xuất kho';
      default: return action;
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'add': return 'badge-green';
      case 'update': return 'badge-blue';
      case 'delete': return 'badge-red';
      case 'import': return 'badge-green';
      case 'export': return 'badge-red';
      default: return 'badge-blue';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">📋 Lịch sử nhập liệu</h3>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Tổng: {historyLogs.length} hoạt động
        </div>
      </div>

      {historyLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          Chưa có hoạt động nào
        </div>
      ) : (
        <div className="history-timeline">
          {historyLogs.slice().reverse().map((log) => (
            <div key={log.id} className="history-item">
              <div className="history-date">{formatDateTime(log.timestamp)}</div>
              <div className="history-content">
                <div className="history-badge">
                  <span className={`badge ${getActionColor(log.action)}`}>
                    {getActionLabel(log.action)}
                  </span>
                </div>
                <div className="history-details">
                  <h4>{log.productName}</h4>
                  <p>{log.details}</p>
                  <div className="history-meta">
                    <span>👤 {log.user}</span>
                    {log.productSku && <span>SKU: {log.productSku}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryTab;