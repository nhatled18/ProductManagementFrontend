import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import "../assets/styles/Dashboard.css";
import OverviewTab from './OverviewTabs';
import ProductsTab from './ProductTabs';
import ProductDisplay from './ProductDisplay';
import TransactionTab from './TransactionTab';
import HistoryTab from './HistoryTab';

function DashboardPage({ currentUser, onLogout }) {
  const location = useLocation();
  
  const [products, setProducts] = useState([
    { 
      id: 1, 
      group: 'HH S8 T1',
      sku: 'A', 
      productName: 'Lucy',
      quantity: 1,
      warehouseStock: 0,
      newStock: 0,
      soldStock: 0,
      damagedStock: 0,
      endingStock: 3,
      cost: 0,
      retailPrice: 30000
    },
    { 
      id: 2, 
      group: 'HH S8 T2',
      sku: 'B', 
      productName: 'Mira',
      quantity: 6,
      warehouseStock: 0,
      newStock: 0,
      soldStock: 0,
      damagedStock: 0,
      endingStock: 3,
      cost: 0,
      retailPrice: 30000
    },
    { 
      id: 3, 
      group: 'HH S8 T3',
      sku: 'C', 
      productName: 'Lisanna',
      quantity: 8,
      warehouseStock: 0,
      newStock: 0,
      soldStock: 0,
      damagedStock: 0,
      endingStock: 3,
      cost: 0,
      retailPrice: 30000
    },
    { 
      id: 4, 
      group: 'HH S8 T4',
      sku: 'D', 
      productName: 'Natsu',
      quantity: 3,
      warehouseStock: 0,
      newStock: 0,
      soldStock: 0,
      damagedStock: 0,
      endingStock: 3,
      cost: 0,
      retailPrice: 30000
    },
    { 
      id: 5, 
      group: 'HH S8 T6',
      sku: 'E', 
      productName: 'Wendy',
      quantity: 3,
      warehouseStock: 0,
      newStock: 0,
      soldStock: 0,
      damagedStock: 0,
      endingStock: 3,
      cost: 0,
      retailPrice: 30000
    }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, productId: 1, type: 'import', quantity: 10, date: '2025-10-15', note: 'Nhập hàng từ nhà cung cấp A' },
    { id: 2, productId: 2, type: 'export', quantity: 5, date: '2025-10-16', note: 'Xuất hàng cho đơn hàng #1001' },
    { id: 3, productId: 3, type: 'export', quantity: 3, date: '2025-10-17', note: 'Xuất hàng cho đơn hàng #1002' }
  ]);

  const [historyLogs, setHistoryLogs] = useState([])

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

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
    addHistoryLog('add', product.productName, product.sku, 
      `Thêm sản phẩm mới với số lượng ${product.quantity}, cost ${product.cost.toLocaleString('vi-VN')}₫, giá niêm yết ${product.retailPrice.toLocaleString('vi-VN')}₫`
    );
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    const oldProduct = products.find(p => p.id === id);
    setProducts(products.map(p => p.id === id ? updatedProduct : p));
    addHistoryLog('update', updatedProduct.productName, updatedProduct.sku,
      `Cập nhật thông tin sản phẩm từ số lượng ${oldProduct.quantity} thành ${updatedProduct.quantity}`
    );
  };

  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    addHistoryLog('delete', product.productName, product.sku,
      `Xóa sản phẩm khỏi hệ thống`
    );
  };

  return (
    <div className="dashboard-layout">
      <div className="tabs-vertical">
        <Link to="/dashboard" className={`tab-vertical ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Tổng quan
        </Link>
        <Link to="/dashboard/products" className={`tab-vertical ${location.pathname === '/dashboard/products' ? 'active' : ''}`}>
          Quản lý sản phẩm
        </Link>
        <Link to="/dashboard/import" className={`tab-vertical ${location.pathname === '/dashboard/import' ? 'active' : ''}`}>
          Nhập kho
        </Link>
        <Link to="/dashboard/export" className={`tab-vertical ${location.pathname === '/dashboard/export' ? 'active' : ''}`}>
          Xuất kho
        </Link>
        <Link to="/dashboard/display" className={`tab-vertical ${location.pathname === '/dashboard/display' ? 'active' : ''}`}>
          Trưng bày
        </Link>
        <Link to="/dashboard/history" className={`tab-vertical ${location.pathname === '/dashboard/history' ? 'active' : ''}`}>
          Lịch sử hoạt động
        </Link>
      </div>

      <div className="dashboard-new">
        <div className="dashboard-content">
          <Routes>
            <Route index element={<OverviewTab products={products} transactions={transactions} />} />
            
            <Route path="products" element={
              <ProductsTab 
                products={products} 
                setProducts={setProducts}
                transactions={transactions}
                setTransactions={setTransactions}
                historyLogs={historyLogs}
                setHistoryLogs={setHistoryLogs}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            } />
            
            <Route path="import" element={
              <TransactionTab
                products={products}
                setProducts={setProducts}
                transactions={transactions}
                setTransactions={setTransactions}
                defaultType="import"
                historyLogs={historyLogs}
                setHistoryLogs={setHistoryLogs}
              />
            } />
            
            <Route path="export" element={
              <TransactionTab
                products={products}
                setProducts={setProducts}
                transactions={transactions}
                setTransactions={setTransactions}
                defaultType="export"
                historyLogs={historyLogs}
                setHistoryLogs={setHistoryLogs}
              />
            } />
            
            <Route path="display" element={
              <ProductDisplay products={products} />
            } />
            
            <Route path="history" element={
              <HistoryTab 
                historyLogs={historyLogs} 
                currentUser={currentUser}
              />
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;