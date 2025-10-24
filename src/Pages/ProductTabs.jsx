import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '../Services/ProductServices';
import { transactionService } from "../Services/TransactionServices";
import "../assets/styles/Product.css";
import "../assets/styles/Common.css";
import SearchBox from '../Components/SearchBox';
import ProductForm from '../Components/ProductForm';
import ProductTable from '../Components/ProductTable';
import Pagination from '../Components/Pagination';

function ProductsTab({ 
  products, 
  setProducts, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  // transactions, 
  // setTransactions, 
  // historyLogs, 
  // setHistoryLogs,
  onRefreshData
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // ========== THÊM MỚI: State cho Filter & Delete All ==========
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    group: '',
    stockRange: '',
    priceRange: '',
    sortBy: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  // ========== Lọc sản phẩm theo search VÀ filter ==========
  let filteredProducts = products.filter(p => {
    const name = p.productName || "";
    const sku = p.sku || "";
    const group = p.group || "";
    const term = searchTerm?.toLowerCase() || "";
    return name.toLowerCase().includes(term) || 
           sku.toLowerCase().includes(term) || 
           group.toLowerCase().includes(term);
  });

  // Apply filters
  if (filters.group) {
    filteredProducts = filteredProducts.filter(p => p.group === filters.group);
  }
  
  if (filters.stockRange) {
    if (filters.stockRange === 'low') {
      filteredProducts = filteredProducts.filter(p => (p.endingStock || 0) < 50);
    } else if (filters.stockRange === 'medium') {
      filteredProducts = filteredProducts.filter(p => (p.endingStock || 0) >= 50 && (p.endingStock || 0) <= 200);
    } else if (filters.stockRange === 'high') {
      filteredProducts = filteredProducts.filter(p => (p.endingStock || 0) > 200);
    }
  }
  
  if (filters.priceRange) {
    if (filters.priceRange === 'low') {
      filteredProducts = filteredProducts.filter(p => (p.retailPrice || 0) < 200000);
    } else if (filters.priceRange === 'medium') {
      filteredProducts = filteredProducts.filter(p => (p.retailPrice || 0) >= 200000 && (p.retailPrice || 0) <= 400000);
    } else if (filters.priceRange === 'high') {
      filteredProducts = filteredProducts.filter(p => (p.retailPrice || 0) > 400000);
    }
  }

  // Apply sorting
  if (filters.sortBy) {
    if (filters.sortBy === 'name_asc') {
      filteredProducts.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
    } else if (filters.sortBy === 'name_desc') {
      filteredProducts.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''));
    } else if (filters.sortBy === 'price_asc') {
      filteredProducts.sort((a, b) => (a.retailPrice || 0) - (b.retailPrice || 0));
    } else if (filters.sortBy === 'price_desc') {
      filteredProducts.sort((a, b) => (b.retailPrice || 0) - (a.retailPrice || 0));
    } else if (filters.sortBy === 'stock_asc') {
      filteredProducts.sort((a, b) => (a.endingStock || 0) - (b.endingStock || 0));
    } else if (filters.sortBy === 'stock_desc') {
      filteredProducts.sort((a, b) => (b.endingStock || 0) - (a.endingStock || 0));
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Filter Functions
  const groups = [...new Set(products.map(p => p.group).filter(Boolean))];

  const applyFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    const active = [];
    if (newFilters.group) active.push(`Nhóm: ${newFilters.group}`);
    if (newFilters.stockRange) {
      const stockLabels = { low: 'Dưới 50', medium: '50-200', high: 'Trên 200' };
      active.push(`Tồn kho: ${stockLabels[newFilters.stockRange]}`);
    }
    if (newFilters.priceRange) {
      const priceLabels = { low: 'Dưới 200k', medium: '200k-400k', high: 'Trên 400k' };
      active.push(`Giá: ${priceLabels[newFilters.priceRange]}`);
    }
    if (newFilters.sortBy) {
      const sortLabels = {
        name_asc: 'Tên A-Z', name_desc: 'Tên Z-A',
        price_asc: 'Giá thấp → cao', price_desc: 'Giá cao → thấp',
        stock_asc: 'Tồn kho tăng dần', stock_desc: 'Tồn kho giảm dần'
      };
      active.push(`Sắp xếp: ${sortLabels[newFilters.sortBy]}`);
    }
    
    setActiveFilters(active);
  };

  const removeFilter = (filterText) => {
    const newFilters = { ...filters };
    if (filterText.includes('Nhóm:')) newFilters.group = '';
    else if (filterText.includes('Tồn kho:')) newFilters.stockRange = '';
    else if (filterText.includes('Giá:')) newFilters.priceRange = '';
    else if (filterText.includes('Sắp xếp:')) newFilters.sortBy = '';
    
    setFilters(newFilters);
    const active = activeFilters.filter(f => f !== filterText);
    setActiveFilters(active);
  };

  const clearAllFilters = () => {
    setFilters({ group: '', stockRange: '', priceRange: '', sortBy: '' });
    setActiveFilters([]);
  };

  //  THÊM MỚI: Delete All Functions
  const handleDeleteAllClick = () => {
    if (products.length === 0) {
      alert('Không có sản phẩm nào để xóa!');
      return;
    }
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAll = async () => {
    setIsDeleting(true);
    
    try {
      // Xóa tất cả sản phẩm
      const deletePromises = products.map(product =>
        productService.delete(product.id)
      );

      const results = await Promise.allSettled(deletePromises);
      const success = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0) {
        console.warn("Danh sách sản phẩm xóa lỗi:");
        failed.forEach((f, i) => {
          console.warn(`❌ Lỗi ${i + 1}:`, f.reason?.response?.data || f.reason?.message);
        });
      }

      // Refresh data
      if (onRefreshData) {
        await onRefreshData();
      }

      setShowDeleteModal(false);
      
      alert(`✅ Xóa hoàn tất!\n\nThành công: ${success.length}\nLỗi: ${failed.length}`);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Có lỗi khi xóa sản phẩm. Vui lòng thử lại!');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await productService.create(newProduct);
      if (onAddProduct) {
        onAddProduct(response.data);
      } else {
        setProducts([...products, response.data]);
      }
      setShowAddProduct(false);
      if (onRefreshData) {
        await onRefreshData();
      }
      alert('Thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Có lỗi khi thêm sản phẩm. Vui lòng thử lại!');
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await productService.update(id, updatedProduct);
      if (onUpdateProduct) {
        onUpdateProduct(id, response.data);
      } else {
        setProducts(products.map(p => p.id === id ? response.data : p));
      }
      if (onRefreshData) {
        await onRefreshData();
      }
      alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi khi cập nhật sản phẩm. Vui lòng thử lại!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.delete(id);
        if (onDeleteProduct) {
          onDeleteProduct(id);
        } else {
          setProducts(products.filter(p => p.id !== id));
        }
        if (onRefreshData) {
          await onRefreshData();
        }
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi khi xóa sản phẩm. Vui lòng thử lại!');
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setImporting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const importedProducts = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        try {
          if (!row['Tên mặt hàng'] || !row['SKU']) {
            errors.push(`Dòng ${index + 2}: Thiếu tên mặt hàng hoặc SKU`);
            return;
          }

          const product = {
            group: row['Nhóm'] ? String(row['Nhóm']).trim() : '',
            sku: String(row['SKU']).trim(),
            productName: String(row['Tên mặt hàng']).trim(),
            quantity: row['Số lượng'] ? Number(row['Số lượng']) : 0,
            displayStock: row['Tồn kho hiển thị'] ? Number(row['Tồn kho hiển thị']) : 0,
            warehouseStock: row['Tồn kho bán'] ? Number(row['Tồn kho bán']) : 0,
            newStock: row['Tổng nhập mới'] ? Number(row['Tổng nhập mới']) : 0,
            soldStock: row['Tổng đã bán'] ? Number(row['Tổng đã bán']) : 0,
            damagedStock: row['Hong mất'] ? Number(row['Hong mất']) : 0,
            endingStock: row['Tồn kho cuối'] ? Number(row['Tồn kho cuối']) : 0,
            cost: row['Cost'] ? Number(row['Cost']) : 0,
            retailPrice: row['Giá niêm yết'] ? Number(row['Giá niêm yết']) : 0
          };

          if (isNaN(product.quantity) || product.quantity < 0) {
            errors.push(`Dòng ${index + 2}: Số lượng không hợp lệ`);
            return;
          }
          if (isNaN(product.cost) || product.cost < 0) {
            errors.push(`Dòng ${index + 2}: Cost không hợp lệ`);
            return;
          }
          if (isNaN(product.retailPrice) || product.retailPrice < 0) {
            errors.push(`Dòng ${index + 2}: Giá niêm yết không hợp lệ`);
            return;
          }

          const isDuplicate = products.some(p => p.sku === product.sku) ||
            importedProducts.some(p => p.sku === product.sku);
          if (isDuplicate) {
            errors.push(`Dòng ${index + 2}: SKU "${product.sku}" đã tồn tại`);
            return;
          }

          importedProducts.push(product);
        } catch (error) {
          errors.push(`Dòng ${index + 2}: Lỗi xử lý dữ liệu - ${error.message}`);
        }
      });

      if (errors.length > 0) {
        const errorMessage = `Có ${errors.length} lỗi khi import:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : ''}`;
        alert(errorMessage);
      }

      if (importedProducts.length > 0) {
        if (confirm(`Tìm thấy ${importedProducts.length} sản phẩm hợp lệ. Bạn có muốn import không?`)) {
          try {
            const importPromises = importedProducts.map(product =>
              productService.create(product)
            );

            const results = await Promise.allSettled(importPromises);
            const success = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');

            if (failed.length > 0) {
              console.warn("Danh sách sản phẩm import lỗi:");
              failed.forEach((f, i) => {
                console.warn(`❌ Lỗi ${i + 1}:`, f.reason?.response?.data || f.reason?.message);
              });
            }

            const transactionPromises = success.map(s =>
              transactionService.create({
                productId: s.value.data.id,
                type: 'import',
                quantity: s.value.data.quantity,
                note: `Import từ Excel - Tồn kho ban đầu: ${s.value.data.quantity}`
              })
            );

            await Promise.allSettled(transactionPromises);

            if (onRefreshData) {
              await onRefreshData();
            }
            
            setCurrentPage(1);
            alert(`✅ Import hoàn tất!\n\nThành công: ${success.length}\nLỗi: ${failed.length}`);
          } catch (error) {
            console.error('Error importing products:', error);
            alert('Có lỗi khi import sản phẩm. Vui lòng thử lại!');
          }
        }
      } else if (errors.length === 0) {
        alert('Không tìm thấy dữ liệu hợp lệ trong file Excel');
      }

    } catch (error) {
      console.error('Error importing file:', error);
      alert('Có lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <SearchBox 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
            {/* ========== THÊM MỚI: Filter Button ========== */}
            <button
              className="btn-secondary"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              style={{ position: 'relative' }}
            >
              <span>🔽</span>
              <span>Bộ Lọc</span>
              {activeFilters.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#4F46E5',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Filter Dropdown Menu */}
            {showFilterMenu && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                  }}
                  onClick={() => setShowFilterMenu(false)}
                />
                
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '250px',
                  marginTop: '8px',
                  width: '280px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '16px' 
                    }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                        Lọc sản phẩm
                      </h3>
                      <button
                        onClick={() => setShowFilterMenu(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          padding: '0'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Nhóm sản phẩm
                      </label>
                      <select
                        value={filters.group}
                        onChange={(e) => applyFilter('group', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      >
                        <option value="">Tất cả nhóm</option>
                        {groups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Tồn kho
                      </label>
                      <select
                        value={filters.stockRange}
                        onChange={(e) => applyFilter('stockRange', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      >
                        <option value="">Tất cả</option>
                        <option value="low">Dưới 50</option>
                        <option value="medium">50 - 200</option>
                        <option value="high">Trên 200</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Giá niêm yết
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => applyFilter('priceRange', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      >
                        <option value="">Tất cả</option>
                        <option value="low">Dưới 200,000₫</option>
                        <option value="medium">200,000₫ - 400,000₫</option>
                        <option value="high">Trên 400,000₫</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Sắp xếp theo
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => applyFilter('sortBy', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      >
                        <option value="">Mặc định</option>
                        <option value="name_asc">Tên A → Z</option>
                        <option value="name_desc">Tên Z → A</option>
                        <option value="price_asc">Giá thấp → cao</option>
                        <option value="price_desc">Giá cao → thấp</option>
                        <option value="stock_asc">Tồn kho tăng dần</option>
                        <option value="stock_desc">Tồn kho giảm dần</option>
                      </select>
                    </div>

                    {activeFilters.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          fontSize: '13px',
                          color: '#4F46E5',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            
            <button
              className="btn-secondary"
              onClick={handleDeleteAllClick}
              disabled={products.length === 0}
              style={{
                opacity: products.length === 0 ? 0.5 : 1,
                cursor: products.length === 0 ? 'not-allowed' : 'pointer',
                backgroundColor: products.length > 0 ? '#fee2e2' : undefined,
                color: products.length > 0 ? '#dc2626' : undefined,
                borderColor: products.length > 0 ? '#fecaca' : undefined
              }}
            >
              <span>🗑️</span>
              <span>Xóa Tất Cả ({products.length})</span>
            </button>

            {/* GIỮ NGUYÊN: Original Buttons */}
            <button
              className="btn-secondary"
              onClick={handleImportClick}
              disabled={importing}
            >
              <span>📥</span>
              <span>{importing ? 'Đang import...' : 'Import Excel'}</span>
            </button>
            
            <button
              className="btn-primary"
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              <span>➕</span>
              <span>Thêm Sản Phẩm</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* ========== Active Filters ========== */}
        {activeFilters.length > 0 && (
          <div style={{ 
            padding: '0 20px 16px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            flexWrap: 'wrap'
          }}>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4F46E5',
                    cursor: 'pointer',
                    padding: '2px',
                    fontSize: '16px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '13px',
                color: '#4F46E5',
                textDecoration: 'underline',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {showAddProduct && (
          <ProductForm 
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddProduct(false)}
          />
        )}

        
        <ProductTable 
          products={currentProducts}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProducts.length}
        />
      </div>

      {/* ========== Delete All Confirmation Modal ========== */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)'
            }}
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          
          {/* Modal */}
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '450px',
            width: '100%',
            padding: '24px'
          }}>
            {/* Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              background: '#FEE2E2',
              borderRadius: '50%'
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              textAlign: 'center',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Xác nhận xóa toàn bộ sản phẩm
            </h3>

            <p style={{
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: '24px',
              lineHeight: '1.6',
              margin: '0 0 24px 0'
            }}>
              Bạn có chắc chắn muốn xóa{' '}
              <span style={{ fontWeight: '600', color: '#DC2626' }}>
                TẤT CẢ {products.length} sản phẩm
              </span>{' '}
              trong hệ thống?
              <br />
              <span style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px', display: 'block', fontWeight: '600' }}>
                ⚠️ Hành động này không thể hoàn tác!
              </span>
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteAll}
                disabled={isDeleting}
                className="btn-primary"
                style={{ 
                  flex: 1,
                  backgroundColor: '#DC2626',
                  borderColor: '#DC2626'
                }}
              >
                {isDeleting ? 'Đang xóa...' : `Xóa ${products.length} sản phẩm`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTab;