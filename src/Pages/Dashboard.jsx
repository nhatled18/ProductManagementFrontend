// pages/DashboardPage.jsx - FIXED VERSION
import React, { useState } from 'react';
import "../assets/styles/Dashboard.css";
import OverviewTab from './OverviewTabs';
import ProductsTab from './ProductTabs';
import TransactionTab from './TransactionTab';
import HistoryTab from './HistoryTab';

function DashboardPage({ currentUser, onLogout }) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Dell XPS 13', sku: 'LAP001', quantity: 25, price: 25000000, category: 'Electronics', minStock: 5 },
    { id: 2, name: 'iPhone 15 Pro', sku: 'PHN001', quantity: 40, price: 28000000, category: 'Electronics', minStock: 10 },
    { id: 3, name: 'Samsung Galaxy S24', sku: 'PHN002', quantity: 30, price: 22000000, category: 'Electronics', minStock: 10 },
    { id: 4, name: 'iPad Air M2', sku: 'TAB001', quantity: 15, price: 18000000, category: 'Electronics', minStock: 5 },
    { id: 5, name: 'AirPods Pro 2', sku: 'AUD001', quantity: 60, price: 6000000, category: 'Accessories', minStock: 20 }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, productId: 1, type: 'import', quantity: 10, date: '2025-10-15', note: 'Nhập hàng từ nhà cung cấp A' },
    { id: 2, productId: 2, type: 'export', quantity: 5, date: '2025-10-16', note: 'Xuất hàng cho đơn hàng #1001' },
    { id: 3, productId: 3, type: 'export', quantity: 3, date: '2025-10-17', note: 'Xuất hàng cho đơn hàng #1002' }
  ]);

  // History Logs State
  const [historyLogs, setHistoryLogs] = useState([]);

  // Function to add history log
  const addHistoryLog = (action, productName, productSku, details) => {
    const newLog = {
      id: Date.now(),
      action: action,
      productName: productName,
      productSku: productSku,
      details: details,
      user: currentUser,
      timestamp: new Date().toISOString()
    };
    setHistoryLogs([...historyLogs, newLog]);
  };

  // Wrapper functions for ProductsTab
  const handleAddProduct = (product) => {
    setProducts([...products, product]);
    addHistoryLog('add', product.name, product.sku, 
      `Thêm sản phẩm mới với số lượng ${product.quantity}, giá ${product.price.toLocaleString('vi-VN')}₫`
    );
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    const oldProduct = products.find(p => p.id === id);
    setProducts(products.map(p => p.id === id ? updatedProduct : p));
    addHistoryLog('update', updatedProduct.name, updatedProduct.sku,
      `Cập nhật thông tin sản phẩm từ số lượng ${oldProduct.quantity} thành ${updatedProduct.quantity}`
    );
  };

  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    addHistoryLog('delete', product.name, product.sku,
      `Xóa sản phẩm khỏi hệ thống`
    );
  };

  return (
    <div className="dashboard-layout">
      <div className="tabs-vertical">
        <button
          className={`tab-vertical ${currentTab === 'overview' ? 'active' : ''}`}
          onClick={() => setCurrentTab('overview')}
        >
          📊 Tổng quan
        </button>
        <button
          className={`tab-vertical ${currentTab === 'products' ? 'active' : ''}`}
          onClick={() => setCurrentTab('products')}
        >
          📦 Quản lý sản phẩm
        </button>
        <button
          className={`tab-vertical ${currentTab === 'import' ? 'active' : ''}`}
          onClick={() => setCurrentTab('import')}
        >
          📥 Nhập kho
        </button>
        <button
          className={`tab-vertical ${currentTab === 'export' ? 'active' : ''}`}
          onClick={() => setCurrentTab('export')}
        >
          📤 Xuất kho
        </button>
        <button
          className={`tab-vertical ${currentTab === 'display' ? 'active' : ''}`}
          onClick={() => setCurrentTab('display')}
        >
          🎨 Trưng bày
        </button>
        <button
          className={`tab-vertical ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentTab('history')}
        >
          📋 Lịch sử hoạt động
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-new">
        <div className="dashboard-content">
          {currentTab === 'overview' && (
            <OverviewTab products={products} transactions={transactions} />
          )}
          {currentTab === 'products' && (
            <ProductsTab 
              products={products} 
              setProducts={setProducts}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {['import', 'export', 'display'].includes(currentTab) && (
            <TransactionTab
              products={products}
              setProducts={setProducts}
              transactions={transactions}
              setTransactions={setTransactions}
              defaultType={currentTab}
              historyLogs={historyLogs}      // ✅ Truyền state
              setHistoryLogs={setHistoryLogs} // ✅ Truyền setter function
            />
          )}
          {currentTab === 'history' && (
            <HistoryTab 
              historyLogs={historyLogs} 
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;