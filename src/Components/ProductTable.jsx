// components/ProductTable.jsx
import { useState } from 'react';
import { formatCurrency } from '../utils/helper';

function ProductTable({ products, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditingProduct({ ...product });
  };

  const saveEdit = () => {
    onUpdate(editingId, editingProduct);
    setEditingId(null);
    setEditingProduct(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingProduct(null);
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th className="text-center">Tồn kho</th>
            <th style={{ textAlign: 'right' }}>Giá</th>
            <th style={{ textAlign: 'right' }}>Giá trị</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {editingId === product.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', textAlign: 'right' }}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {formatCurrency(editingProduct.quantity * editingProduct.price)}
                  </td>
                  <td className="text-center">
                    <div className="flex" style={{ justifyContent: 'center' }}>
                      <button
                        className="icon-btn"
                        onClick={saveEdit}
                        style={{ color: '#4caf50' }}
                      >
                        💾
                      </button>
                      <button
                        className="icon-btn"
                        onClick={cancelEdit}
                        style={{ color: '#9e9e9e' }}
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ fontWeight: '500' }}>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>
                    <span className="badge badge-blue">{product.category}</span>
                  </td>
                  <td className="text-center">
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: product.quantity <= product.minStock ? '#d32f2f' : '#333'
                      }}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(product.price)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(product.quantity * product.price)}
                  </td>
                  <td className="text-center">
                    <div className="flex" style={{ justifyContent: 'center' }}>
                      <button
                        className="icon-btn"
                        onClick={() => startEdit(product)}
                        style={{ color: '#2196f3' }}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => onDelete(product.id)}
                        style={{ color: '#f44336' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;