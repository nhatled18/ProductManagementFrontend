// pages/ProductsTab.jsx
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '../Services/ProductServices';
import { transactionService } from "../Services/TransactionServices";
import { historyService } from '../Services/HistoryServices';
import "../assets/styles/Product.css";
import "../assets/styles/Common.css";
import SearchBox from '../Components/SearchBox';
import ProductForm from '../Components/ProductForm';
import ProductTable from '../Components/ProductTable';

function ProductsTab({ 
  products, 
  setProducts, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  transactions, 
  setTransactions, 
  historyLogs, 
  setHistoryLogs,
  onRefreshData // Callback để refresh data từ Dashboard
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const filteredProducts = products.filter(p => {
    const name = p.productName || "";
    const sku = p.sku || "";
    const group = p.group || "";
    const term = searchTerm?.toLowerCase() || "";
    return name.toLowerCase().includes(term) || 
           sku.toLowerCase().includes(term) || 
           group.toLowerCase().includes(term);
  });

  // Thêm sản phẩm mới với API
  const handleAddProduct = async (newProduct) => {
    try {
      // Gọi API tạo product
      const response = await productService.create(newProduct);
      
      // Update local state
      if (onAddProduct) {
        onAddProduct(response.data);
      } else {
        setProducts([...products, response.data]);
      }
      
      setShowAddProduct(false);
      
      // Refresh data nếu có callback
      if (onRefreshData) {
        await onRefreshData();
      }
      
      alert('Thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Có lỗi khi thêm sản phẩm. Vui lòng thử lại!');
    }
  };

  // Cập nhật sản phẩm với API
  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      // Gọi API update
      const response = await productService.update(id, updatedProduct);
      
      // Update local state
      if (onUpdateProduct) {
        onUpdateProduct(id, response.data);
      } else {
        setProducts(products.map(p => p.id === id ? response.data : p));
      }
      
      // Refresh data
      if (onRefreshData) {
        await onRefreshData();
      }
      
      alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi khi cập nhật sản phẩm. Vui lòng thử lại!');
    }
  };

  // Xóa sản phẩm với API
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        // Gọi API delete
        await productService.delete(id);
        
        // Update local state
        if (onDeleteProduct) {
          onDeleteProduct(id);
        } else {
          setProducts(products.filter(p => p.id !== id));
        }
        
        // Refresh data
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

  // Import Excel với API
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

      // Validate và transform data (giữ nguyên code cũ)
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

          // Validate
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

          // Kiểm tra SKU trùng
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

      // Hiển thị errors
      if (errors.length > 0) {
        const errorMessage = `Có ${errors.length} lỗi khi import:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : ''}`;
        alert(errorMessage);
      }

      // Import products qua API
      if (importedProducts.length > 0) {
        if (confirm(`Tìm thấy ${importedProducts.length} sản phẩm hợp lệ. Bạn có muốn import không?`)) {
          try {
            // Gọi API để import từng product
            const importPromises = importedProducts.map(product => 
              productService.create(product)
            );
            
            const results = await Promise.all(importPromises);
            
            // Tạo transactions cho các sản phẩm import
            const transactionPromises = results.map(result => 
              transactionService.create({
                productId: result.data.id,
                type: 'import',
                quantity: result.data.quantity,
                note: `Import từ Excel - Tồn kho ban đầu: ${result.data.quantity}`
              })
            );
            
            await Promise.all(transactionPromises);
            
            // Refresh tất cả data
            if (onRefreshData) {
              await onRefreshData();
            }
            
            alert(`Đã import thành công ${importedProducts.length} sản phẩm!`);
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
          <div style={{ display: 'flex', gap: '10px' }}>
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

        {showAddProduct && (
          <ProductForm 
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddProduct(false)}
          />
        )}

        <ProductTable 
          products={filteredProducts}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
}

export default ProductsTab;