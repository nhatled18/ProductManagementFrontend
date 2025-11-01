// src/Pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import "../assets/styles/Common.css";
import "../assets/styles/Dashboard.css";

// Import Services
import { productService } from '../Services/ProductServices';
import { historyService } from '../Services/HistoryServices';
import { inventoryService } from '../Services/InventoryServices';

// Import Components
import OverviewTab from './OverviewTabs';
import ProductsTab from './ProductTabs';
import InventoryTab from './InventoryTabs';
import TransactionTab from './TransactionTab';
import HistoryTab from './HistoryTab';

function DashboardPage({ currentUser, onLogout }) {
  const location = useLocation();

  // State
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ THÊM REF ĐỂ TRACK OPERATIONS ĐANG XỬ LÝ
  const operationsInProgress = useRef(new Set());

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, inventoriesRes, historyRes] = await Promise.all([
        productService.getAll(),
        inventoryService.getAll(),
        historyService.getAll()
      ]);

      setProducts(Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.data || []);
      setInventories(Array.isArray(inventoriesRes.data) ? inventoriesRes.data : inventoriesRes.data?.data || []);
      setHistoryLogs(Array.isArray(historyRes.data) ? historyRes.data : historyRes.data?.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Refresh functions
  const refreshInventories = async () => {
    try {
      const res = await inventoryService.getAll();
      setInventories(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const refreshProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const refreshHistory = async () => {
    try {
      const res = await historyService.getAll();
      setHistoryLogs(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  // === CRUD HANDLERS (✅ ĐÃ SỬA AN TOÀN) ===

  // Helper: Làm sạch dữ liệu sản phẩm
  const cleanProductData = (product) => {
    const { id, createdAt, updatedAt, ...data } = product;
    return {
      productName: data.productName?.trim() || '',
      sku: data.sku?.trim() || '',
      group: data.group?.trim() || null,
      stockType1: data.stockType1?.trim() || null,
      stockType2: data.stockType2?.trim() || null,
      project: data.project?.trim() || null,
      unit: data.unit?.trim() || null,
      note: data.note?.trim() || null,
      cost: Number(data.cost) || 0,
      retailPrice: Number(data.retailPrice) || 0,
    };
  };

  // ✅ FIX: THÊM PROTECTION NGĂN DOUBLE CALL
  const handleAddProduct = async (product) => {
    // Tạo unique key cho operation này
    const operationKey = `add_${product.sku}_${Date.now()}`;
    
    // ✅ KIỂM TRA XEM ĐÃ CÓ OPERATION VỚI SKU NÀY ĐANG CHẠY KHÔNG
    const existingOp = Array.from(operationsInProgress.current)
      .find(key => key.includes(`add_${product.sku}`));
    
    if (existingOp) {
      console.warn('⚠️ [DASHBOARD] Operation đang xử lý, bỏ qua request trùng:', existingOp);
      return;
    }

    // ✅ ĐÁNH DẤU OPERATION ĐANG XỬ LÝ
    operationsInProgress.current.add(operationKey);
    console.log('🔵 [DASHBOARD] Bắt đầu thêm sản phẩm:', operationKey);

    try {
      const cleanData = cleanProductData(product);
      console.log("📦 [DASHBOARD] Dữ liệu gửi đi:", cleanData);

      const response = await productService.create(cleanData);
      
      console.log('✅ [DASHBOARD] Thêm thành công:', response.data);
      setProducts(prev => [...prev, response.data]);
      await refreshHistory();
      
      alert('Thêm sản phẩm thành công!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      console.error('❌ [DASHBOARD] Lỗi thêm sản phẩm:', error.response?.data);
      alert("Lỗi: " + msg);
      throw error;
    } finally {
      // ✅ LUÔN XÓA OPERATION KHỎI TRACKING
      operationsInProgress.current.delete(operationKey);
      console.log('🔴 [DASHBOARD] Hoàn tất operation:', operationKey);
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    const operationKey = `update_${id}_${Date.now()}`;
    
    if (operationsInProgress.current.has(operationKey)) {
      console.warn('⚠️ [DASHBOARD] Update operation đang chạy, bỏ qua');
      return;
    }

    operationsInProgress.current.add(operationKey);
    console.log('🔵 [DASHBOARD] Bắt đầu update:', operationKey);

    try {
      const cleanData = cleanProductData(updatedProduct);
      console.log("🔄 [DASHBOARD] Cập nhật sản phẩm ID", id, ":", cleanData);

      const response = await productService.update(id, cleanData);
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      await refreshHistory();
      
      alert('Cập nhật sản phẩm thành công!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      console.error('❌ [DASHBOARD] Lỗi cập nhật:', error.response?.data);
      alert("Lỗi: " + msg);
      throw error;
    } finally {
      operationsInProgress.current.delete(operationKey);
      console.log('🔴 [DASHBOARD] Hoàn tất update:', operationKey);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    
    const operationKey = `delete_${id}_${Date.now()}`;
    
    if (operationsInProgress.current.has(operationKey)) {
      console.warn('⚠️ [DASHBOARD] Delete operation đang chạy, bỏ qua');
      return;
    }

    operationsInProgress.current.add(operationKey);
    console.log('🔵 [DASHBOARD] Bắt đầu xóa:', operationKey);

    try {
      console.log('🗑️ [DASHBOARD] Bắt đầu xóa product ID:', id);
      
      const response = await productService.delete(id);
      console.log('✅ [DASHBOARD] Response:', response);

      // Đợi 300ms để transaction commit
      console.log('⏳ [DASHBOARD] Đợi 300ms để transaction commit hoàn toàn...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Refresh data
      console.log('🔄 [DASHBOARD] Bắt đầu refresh data...');
      await Promise.all([
        refreshProducts(),
        refreshHistory()
      ]);
      
      console.log('✅ [DASHBOARD] Hoàn tất! Data đã được refresh');
      alert("Xóa sản phẩm thành công!");

    } catch (error) {
      console.error('❌ [DASHBOARD] Lỗi xóa:', error);
      const msg = error.response?.data?.error || "Không thể xóa";
      alert("Lỗi: " + msg);
      
      await refreshProducts();
    } finally {
      operationsInProgress.current.delete(operationKey);
      console.log('🔴 [DASHBOARD] Hoàn tất delete:', operationKey);
    }
  };

  const handleTransactionComplete = async () => {
    await Promise.all([refreshProducts(), refreshInventories(), refreshHistory()]);
  };

  // Inventory handlers
  const handleAddInventory = (newInv) => setInventories(prev => [...prev, newInv]);
  const handleUpdateInventory = (id, updated) => setInventories(prev => prev.map(i => i.id === id ? updated : i));
  const handleDeleteInventory = (id) => setInventories(prev => prev.filter(i => i.id !== id));

  // Loading & Error UI
  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return (
    <div className="error-center">
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={fetchAllData} className="btn-primary">Thử lại</button>
    </div>
  );

  // Render
  return (
    <div className="dashboard-layout">
      <div className="sidebar-trigger"></div>

      <div className="tabs-vertical">
        <Link to="/dashboard" className={`tab-vertical ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span>Tổng quan</span>
        </Link>
        <Link to="/dashboard/products" className={`tab-vertical ${location.pathname.includes('products') ? 'active' : ''}`}>
          <span>Sản phẩm và vật dụng</span>
        </Link>
        <Link to="/dashboard/import" className={`tab-vertical ${location.pathname.includes('import') ? 'active' : ''}`}>
          <span>Nhập kho</span>
        </Link>
        <Link to="/dashboard/export" className={`tab-vertical ${location.pathname.includes('export') ? 'active' : ''}`}>
          <span>Xuất kho</span>
        </Link>
        <Link to="/dashboard/inventory" className={`tab-vertical ${location.pathname.includes('inventory') ? 'active' : ''}`}>
          <span>Tồn kho</span>
        </Link>
        <Link to="/dashboard/history" className={`tab-vertical ${location.pathname.includes('history') ? 'active' : ''}`}>
          <span>Lịch sử hoạt động</span>
        </Link>
      </div>

      <div className="dashboard-new">
        <div className="dashboard-content">
          <Routes>
            <Route index element={<OverviewTab products={products} />} />
            <Route path="products" element={
              <ProductsTab
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onRefreshData={refreshProducts}
                currentUser={currentUser}
              />
            } />
            <Route path="import" element={
              <TransactionTab type="import" products={products} currentUser={currentUser} onTransactionComplete={handleTransactionComplete} />
            } />
            <Route path="export" element={
              <TransactionTab type="export" products={products} currentUser={currentUser} onTransactionComplete={handleTransactionComplete} />
            } />
            <Route path="inventory" element={
              <InventoryTab
                inventories={inventories}
                products={products}
                onAddInventory={handleAddInventory}
                onUpdateInventory={handleUpdateInventory}
                onDeleteInventory={handleDeleteInventory}
                onRefreshData={refreshInventories}
              />
            } />
            <Route path="history" element={<HistoryTab historyLogs={historyLogs} currentUser={currentUser} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;