// components/RecentTransactions.jsx
import React from 'react';

function RecentTransactions({ transactions, products }) {
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lịch Sử Giao Dịch Gần Đây</h3>
      </div>
      <div>
        {transactions.slice(-5).reverse().map(trans => (
          <div key={trans.id} className="transaction-item">
            <div className="transaction-info">
              <h4>{getProductName(trans.productId)}</h4>
              <p>{trans.note}</p>
              <span className={`badge ${trans.type === 'import' ? 'badge-green' : 'badge-red'}`}>
                {trans.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
              </span>
            </div>
            <div className="transaction-value">
              <div
                className="amount"
                style={{ color: trans.type === 'import' ? '#10b981' : '#ef4444' }}
              >
                {trans.type === 'import' ? '+' : '-'}{trans.quantity}
              </div>
              <div className="date">{trans.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTransactions;