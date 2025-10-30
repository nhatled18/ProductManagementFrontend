import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import "../assets/styles/Common.css";
import "../assets/styles/Dashboard.css";

// Import Services
import { productService } from '../Services/ProductServices';
import { historyService } from '../Services/HistoryServices';
import { transactionService } from '../Services/TransactionServices';
import { inventoryService } from '../Services/InventoryServices';

// Import Components
import OverviewTab from './OverviewTabs';
import ProductsTab from './ProductTabs';
import InventoryTab from './InventoryTabs';
import TransactionTab from './TransactionTab';
import HistoryTab from './HistoryTab';

function DashboardPage({ currentUser, onLogout }) {
  const location = useLocation();

  // State management
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
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

      const [productsRes, inventoriesRes, historyRes, transactionsRes] = await Promise.all([
        productService.getAll(),
        inventoryService.getAll(),
        historyService.getAll(),
        transactionService.getAll()
      ]);

      console.log('inventoriesRes:', inventoriesRes);

      // Dùng Array.isArray() để kiểm tra dữ liệu thực tế có phải array hay không
      setProducts(
        Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.data || []
      );

      setInventories(
        Array.isArray(inventoriesRes.data)
          ? inventoriesRes.data
          : inventoriesRes.data?.data || []
      );

      setHistoryLogs(
        Array.isArray(historyRes.data)
          ? historyRes.data
          : historyRes.data?.data || []
      );

      setTransactions(
        Array.isArray(transactionsRes.data)
          ? transactionsRes.data
          : transactionsRes.data?.data || []
      );

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Refresh riêng từng loại
  const refreshInventories = async () => {
    try {
      const response = await inventoryService.getAll();
      setInventories(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error('Error refreshing inventories:', error);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  const refreshHistory = async () => {
    try {
      const response = await historyService.getAll();
      setHistoryLogs(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error('Error refreshing history:', error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await transactionService.getAll();
      setTransactions(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  // CRUD Handlers
  const handleAddProduct = async (product) => {
    try {
      const response = await productService.create(product);
      setProducts(prev => [...prev, response.data]);
      await refreshHistory();
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await productService.update(id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      await refreshHistory();
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      await refreshHistory();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const handleTransactionComplete = async () => {
    await Promise.all([
      refreshTransactions(),
      refreshProducts(),
      refreshInventories(),
      refreshHistory()
    ]);
  };

  // CRUD cho Inventory
  const handleAddInventory = (newInventory) => {
    setInventories(prev => [...prev, newInventory]);
  };

  const handleUpdateInventory = (id, updatedInventory) => {
    setInventories(prev => prev.map(inv => inv.id === id ? updatedInventory : inv));
  };

  const handleDeleteInventory = (id) => {
    setInventories(prev => prev.filter(inv => inv.id !== id));
  };

  // Loading & Error states
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

  // Render dashboard
  return (
    <div className="dashboard-layout">
      <div className="sidebar-trigger"></div>

      <div className="tabs-vertical">
        <Link to="/dashboard" className={`tab-vertical ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span>Tổng quan</span>
        </Link>
        <Link to="/dashboard/products" className={`tab-vertical ${location.pathname === '/dashboard/products' ? 'active' : ''}`}>
          <span>Sản phẩm và vật dụng</span>
        </Link>
        <Link to="/dashboard/import" className={`tab-vertical ${location.pathname === '/dashboard/import' ? 'active' : ''}`}>
          <span>Nhập kho</span>
        </Link>
        <Link to="/dashboard/export" className={`tab-vertical ${location.pathname === '/dashboard/export' ? 'active' : ''}`}>
          <span>Xuất kho</span>
        </Link>
        <Link to="/dashboard/inventory" className={`tab-vertical ${location.pathname === '/dashboard/inventory' ? 'active' : ''}`}>
          <span>Tồn kho</span>
        </Link>
        <Link to="/dashboard/history" className={`tab-vertical ${location.pathname === '/dashboard/history' ? 'active' : ''}`}>
          <span>Lịch sử hoạt động</span>
        </Link>
      </div>

      <div className="dashboard-new">
        <div className="dashboard-content">
          <Routes>
            <Route index element={<OverviewTab products={products} transactions={transactions} />} />

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
                  currentUser={currentUser}
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
                  type="import"
                  historyLogs={historyLogs}
                  setHistoryLogs={setHistoryLogs}
                  currentUser={currentUser}
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
                  type="export"
                  historyLogs={historyLogs}
                  setHistoryLogs={setHistoryLogs}
                  currentUser={currentUser}
                  onTransactionComplete={handleTransactionComplete}
                />
              }
            />

            <Route
              path="inventory"
              element={
                <InventoryTab
                  inventories={inventories}
                  setInventories={setInventories}
                  products={products}
                  onAddInventory={handleAddInventory}
                  onUpdateInventory={handleUpdateInventory}
                  onDeleteInventory={handleDeleteInventory}
                  onRefreshData={refreshInventories}
                />
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
