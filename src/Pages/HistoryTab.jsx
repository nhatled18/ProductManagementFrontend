import React from 'react';
import "../assets/styles/Common.css";

function HistoryTab({ historyLogs, currentUser }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const weekday = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];
    return `${weekday}, ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionLabel = (action) => {
    switch(action) {
      case 'add': return 'Thêm sản phẩm';
      case 'update': return 'Cập nhật sản phẩm';
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
      case 'export': return 'badge-orange';
      default: return 'badge-blue';
    }
  };

  // Nhóm logs theo ngày (dùng format dd/mm/yyyy)
  const groupByDate = (logs) => {
    const groups = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const dateKey = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(log);
    });
    return groups;
  };

  const groupedLogs = groupByDate(historyLogs);
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => {
    const dateA = groupedLogs[a][0].timestamp;
    const dateB = groupedLogs[b][0].timestamp;
    return new Date(dateB) - new Date(dateA);
  });

  return (
    <div className="history-container">
      <div className="card">
        <div className="card-header-enhanced">
          <div>
            <h3 className="card-title">📋 Lịch sử hoạt động</h3>
            <p className="card-subtitle">Theo dõi toàn bộ hoạt động trong hệ thống</p>
          </div>
        </div>
        {historyLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="history-content">
            {sortedDates.map((dateKey) => {
              const logsInDate = groupedLogs[dateKey];
              const sortedLogs = logsInDate.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
              );
              
              const importCount = logsInDate.filter(l => l.action === 'import').length;
              const exportCount = logsInDate.filter(l => l.action === 'export' || l.action === 'display').length;
              
              return (
                <div key={dateKey} className="date-group">
                  {/* Date Header */}
                  <div className="date-header">
                    <div className="date-header-left">
                      <div className="date-badge">
                        {new Date(sortedLogs[0].timestamp).getDate()}
                      </div>
                      <div className="date-info">
                        <div className="date-title">
                          {formatDate(sortedLogs[0].timestamp)}
                        </div>
                        <div className="date-count">
                          {logsInDate.length} hoạt động
                        </div>
                      </div>
                    </div>
                    <div className="date-stats">
                      📊 {importCount} nhập • {exportCount} xuất
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="activities-list">
                    {sortedLogs.map((log) => (
                      <div key={log.id} className="activity-item">
                        <div className="activity-time">
                          {formatTime(log.timestamp)}
                        </div>
                        
                        <div className="activity-divider"></div>
                        
                        <div className="activity-content">
                          <div className="activity-header">
                            <span className={`badge ${getActionColor(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </div>

                          <h4 className="activity-product-name">{log.productName}</h4>
                          
                          <p className="activity-details">{log.details}</p>

                          <div className="activity-meta">
                            <span className="meta-item">
                              <span className="meta-value">{log.user}</span>
                            </span>
                            {log.productSku && (
                              <span className="meta-item">
                                SKU: <span className="meta-value">{log.productSku}</span>
                              </span>
                            )}
                            {(log.action === 'import' || log.action === 'export' || log.action === 'display') && 
                             log.oldQuantity !== undefined && (
                              <span className="meta-item meta-stock">
                                Tồn kho: 
                                <span className="meta-value">
                                  {log.oldQuantity} → {log.newQuantity}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryTab;