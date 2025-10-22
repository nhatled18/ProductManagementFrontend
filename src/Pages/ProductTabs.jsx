// pages/ProductsTab.jsx
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import "../assets/styles/Product.css";
import "../assets/styles/Common.css";
import SearchBox from '../Components/SearchBox';
import ProductForm from '../Components/ProductForm';
import ProductTable from '../Components/ProductTable';

function ProductsTab({ products, setProducts, onAddProduct, onUpdateProduct, onDeleteProduct, transactions, setTransactions, historyLogs, setHistoryLogs }) {
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

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      ...newProduct
    };
    
    if (onAddProduct) {
      onAddProduct(product);
    } else {
      setProducts([...products, product]);
    }
    setShowAddProduct(false);
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    if (onUpdateProduct) {
      onUpdateProduct(id, updatedProduct);
    } else {
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      if (onDeleteProduct) {
        onDeleteProduct(id);
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra file extension
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

      let nextId = Math.max(...products.map(p => p.id), 0) + 1;

      // Validate và transform data
      const importedProducts = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        try {
          // Validate required fields
          if (!row['Tên mặt hàng'] || !row['SKU']) {
            errors.push(`Dòng ${index + 2}: Thiếu tên mặt hàng hoặc SKU`);
            return;
          }

          // Transform data để khớp với ProductForm
          const product = {
            id: nextId++,
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

          // Validate số lượng và giá
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

      // Hiển thị kết quả
      if (errors.length > 0) {
        const errorMessage = `Có ${errors.length} lỗi khi import:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : ''}`;
        alert(errorMessage);
      }

      if (importedProducts.length > 0) {
        if (confirm(`Tìm thấy ${importedProducts.length} sản phẩm hợp lệ. Bạn có muốn import không?`)) {
          // Import tất cả sản phẩm cùng lúc
          setProducts([...products, ...importedProducts]);
          
          // Tạo lịch sử giao dịch cho các sản phẩm được import
          if (setTransactions && transactions) {
            const currentDate = new Date().toLocaleString('vi-VN');
            const newTransactions = importedProducts.map(product => ({
              id: Math.max(...transactions.map(t => t.id), 0) + transactions.length + product.id,
              productId: product.id,
              type: 'import',
              quantity: product.quantity,
              date: currentDate,
              note: `Import từ Excel - Tồn kho ban đầu: ${product.quantity}`
            }));
            
            setTransactions([...transactions, ...newTransactions]);
          }
          
          // Tạo history logs cho các sản phẩm được import
          if (setHistoryLogs && historyLogs) {
            const currentTimestamp = new Date().toISOString();
            const newHistoryLogs = importedProducts.map(product => ({
              id: Date.now() + product.id,
              action: 'import',
              productName: product.productName,
              productSku: product.sku,
              user: 'Admin',
              details: `Import từ Excel - Thêm sản phẩm mới với số lượng ${product.quantity}, cost ${product.cost.toLocaleString('vi-VN')}₫, giá niêm yết ${product.retailPrice.toLocaleString('vi-VN')}₫`,
              timestamp: currentTimestamp
            }));
            
            setHistoryLogs([...historyLogs, ...newHistoryLogs]);
          }
          
          alert(`Đã import thành công ${importedProducts.length} sản phẩm!`);
        }
      } else if (errors.length === 0) {
        alert('Không tìm thấy dữ liệu hợp lệ trong file Excel');
      }

    } catch (error) {
      console.error('Error importing file:', error);
      alert('Có lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file.');
    } finally {
      setImporting(false);
      // Reset input để có thể chọn lại cùng file
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