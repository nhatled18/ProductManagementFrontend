import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Import Services
import { productService } from '../Services/ProductServices';
import { transactionService } from '../Services/TransactionServices';
import { historyService } from '../Services/HistoryServices';

// Import Styles
import "../assets/styles/Dashboard.css";

// Import Components
import OverviewTab from './OverviewTabs';
import ProductsTab from './ProductTabs';
import ProductDisplay from './ProductDisplay';
import TransactionTab from './TransactionTab';
import HistoryTab from './HistoryTab';

function DashboardPage({ currentUser, onLogout }) {
  const location = useLocation();
  
  // State management
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data khi component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Hàm fetch tất cả data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data song song
      const [productsRes, historyRes, transactionsRes] = await Promise.all([
        productService.getAll(),
        historyService.getAll(),
        transactionService.getAll()
      ]);

      setProducts(productsRes.data || []);
      setHistoryLogs(historyRes.data || []);
      setTransactions(transactionsRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Refresh riêng từng loại data
  const refreshProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  const refreshHistory = async () => {
    try {
      const response = await historyService.getAll();
      setHistoryLogs(response.data || []);
    } catch (error) {
      console.error('Error refreshing history:', error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await transactionService.getAll();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  // Handler khi add product (sync với API)
  const handleAddProduct = async (product) => {
    try {
      const response = await productService.create(product);
      setProducts([...products, response.data]);
      
      // Refresh history
      await refreshHistory();
      
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // Handler khi update product (sync với API)
  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await productService.update(id, updatedProduct);
      setProducts(products.map(p => p.id === id ? response.data : p));
      
      // Refresh history
      await refreshHistory();
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Handler khi delete product (sync với API)
  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      
      // Refresh history
      await refreshHistory();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Handler khi có transaction mới
  const handleTransactionComplete = async () => {
    await Promise.all([
      refreshTransactions(),
      refreshProducts(),
      refreshHistory()
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '16px'
      }}>
        <div style={{ color: '#ef4444', fontSize: '18px' }}>{error}</div>
        <button 
          onClick={fetchAllData}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

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
            <Route 
              index 
              element={
                <OverviewTab 
                  products={products} 
                  transactions={transactions}
                />
              } 
            />
            
            <Route 
              path="products" 
              element={
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
                  onRefreshData={fetchAllData}
                />
              } 
            />
            
            <Route 
              path="import" 
              element={
                <TransactionTab
                  products={products}
                  setProducts={setProducts}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  defaultType="import"
                  historyLogs={historyLogs}
                  setHistoryLogs={setHistoryLogs}
                  onTransactionComplete={handleTransactionComplete}
                />
              } 
            />
            
            <Route 
              path="export" 
              element={
                <TransactionTab
                  products={products}
                  setProducts={setProducts}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  defaultType="export"
                  historyLogs={historyLogs}
                  setHistoryLogs={setHistoryLogs}
                  onTransactionComplete={handleTransactionComplete}
                />
              } 
            />
            
            <Route 
              path="display" 
              element={
                <ProductDisplay products={products} />
              } 
            />
            
            <Route 
              path="history" 
              element={
                <HistoryTab 
                  historyLogs={historyLogs} 
                  currentUser={currentUser}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;