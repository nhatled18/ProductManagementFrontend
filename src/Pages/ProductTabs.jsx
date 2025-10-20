// pages/ProductsTab.jsx
import React, { useState } from 'react';
import "../assets/styles/Product.css";
import "../assets/styles/Common.css";
import SearchBox from '../Components/SearchBox';
import ProductForm from '../Components/ProductForm';
import ProductTable from '../Components/ProductTable';

function ProductsTab({ products, setProducts, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      // Nếu không có, dùng cách cũ
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
     
      if (onDeleteProduct) {
        onDeleteProduct(id);
      } else {
        // Nếu không có, dùng cách cũ
        setProducts(products.filter(p => p.id !== id));
      }
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
          <button
            className="btn-primary"
            onClick={() => setShowAddProduct(!showAddProduct)}
          >
            <span>➕</span>
            <span>Thêm Sản Phẩm</span>
          </button>
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