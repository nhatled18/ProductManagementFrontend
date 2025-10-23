// pages/OverviewTab.jsx
import React from 'react';
import "../assets/styles/Overview.css";
import "../assets/styles/Common.css";
// import StatCard from '../Components/StatCard';
import LowStockAlert from '../Components/LowStockAlert';
import RecentTransactions from '../Components/RecentTransactions';
import { formatCurrency } from '../utils/helper';

function OverviewTab({ products, transactions }) {
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const totalCategories = [...new Set(products.map(p => p.category))].length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Tổng Số Sản Phẩm</h3>
              <p>{products.length}</p>
            </div>
            <div className="stat-icon blue">📦</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Tổng Giá Trị Kho</h3>
              <p style={{ fontSize: '24px' }}>{formatCurrency(totalValue)}</p>
            </div>
            <div className="stat-icon green">💰</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Sản Phẩm Hết Hàng</h3>
              <p>{lowStockProducts.length}</p>
            </div>
            <div className="stat-icon red">⚠️</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Tổng số vật dụng</h3>
              <p>{totalCategories}</p>
            </div>
            <div className="stat-icon yellow">🏷️</div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <LowStockAlert products={lowStockProducts} />
      )}

      <RecentTransactions 
        transactions={transactions} 
        products={products} 
      />
    </div>
  );
}

export default OverviewTab;