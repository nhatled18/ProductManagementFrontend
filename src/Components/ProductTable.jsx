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
            <th>Nhóm</th>
            <th>SKU</th>
            <th>Tên mặt hàng</th>
            <th className="text-center">Số lượng</th>
            <th className="text-center">Tồn kho bán</th>
            <th className="text-center">Tổng nhập mới</th>
            <th className="text-center">Tổng đã bán</th>
            <th className="text-center">Hỏng mất</th>
            <th className="text-center">Tồn kho cuối</th>
            <th style={{ textAlign: 'right' }}>Cost</th>
            <th style={{ textAlign: 'right' }}>Giá niêm yết</th>
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
                      value={editingProduct.group}
                      onChange={(e) => setEditingProduct({ ...editingProduct, group: e.target.value })}
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
                      value={editingProduct.productName}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
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
                      value={editingProduct.warehouseStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, warehouseStock: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.newStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, newStock: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.soldStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, soldStock: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.damagedStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, damagedStock: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.endingStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, endingStock: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', width: '80px', textAlign: 'center' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.cost}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cost: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', textAlign: 'right' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.retailPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, retailPrice: Number(e.target.value) })}
                      className="form-input"
                      style={{ padding: '5px', textAlign: 'right' }}
                    />
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
                  <td>
                    <span className="badge badge-blue">{product.group}</span>
                  </td>
                  <td>{product.sku}</td>
                  <td style={{ fontWeight: '500' }}>{product.productName}</td>
                  <td className="text-center">
                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="text-center">{product.warehouseStock}</td>
                  <td className="text-center">{product.newStock}</td>
                  <td className="text-center">{product.soldStock}</td>
                  <td className="text-center">
                    <span style={{ color: product.damagedStock > 0 ? '#d32f2f' : '#333' }}>
                      {product.damagedStock}
                    </span>
                  </td>
                  <td className="text-center">
                    <span style={{ fontWeight: '600' }}>
                      {product.endingStock}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(product.cost)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(product.retailPrice)}
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