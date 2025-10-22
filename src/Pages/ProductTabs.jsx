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
  const name = p.name || p.productName || "";  // fallback tránh undefined
  const sku = p.sku || "";
  const term = searchTerm?.toLowerCase() || "";
  return name.toLowerCase().includes(term) || sku.toLowerCase().includes(term);
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
          if (!row['Tên sản phẩm'] || !row['SKU']) {
            errors.push(`Dòng ${index + 2}: Thiếu tên sản phẩm hoặc SKU`);
            return;
          }

          // Transform data
          const product = {
            id: nextId++, 
            name: String(row['Tên sản phẩm']).trim(),
            sku: String(row['SKU']).trim(),
            category: row['Danh mục'] ? String(row['Danh mục']).trim() : '',
            quantity: row['Tồn kho'] ? Number(row['Tồn kho']) : 0,
            price: row['Giá'] ? Number(row['Giá']) : 0,
            sellPrice: row['Giá bán'] ? Number(row['Giá bán']) : 0
          };

          // Validate số lượng và giá
          if (isNaN(product.quantity) || product.quantity < 0) {
            errors.push(`Dòng ${index + 2}: Tồn kho không hợp lệ`);
            return;
          }
          if (isNaN(product.price) || product.price < 0) {
            errors.push(`Dòng ${index + 2}: Giá không hợp lệ`);
            return;
          }
          if (isNaN(product.sellPrice) || product.sellPrice < 0) {
            errors.push(`Dòng ${index + 2}: Giá bán không hợp lệ`);
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
              productName: product.name,
              productSku: product.sku,
              user: 'Admin',
              details: `Import từ Excel - Thêm sản phẩm mới với số lượng ${product.quantity}, giá ${product.price.toLocaleString('vi-VN')}₫`,
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