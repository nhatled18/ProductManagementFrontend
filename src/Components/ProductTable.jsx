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
            <th className="text-center">STT</th>
            <th>NHÓM</th>
            <th>SKU</th>
            <th>TÊN SẢN PHẨM</th>
            <th className="text-center">PHÂN LOẠI KHO </th>
            <th className="text-center">PHÂN LOẠI CHI TIẾT</th>
            <th className="text-center">DỰ ÁN</th>
            <th className="text-center">ĐƠN VỊ</th>
            <th className="text-center">GIÁ VỐN</th>
            <th className="text-center">GIÁ NIÊM YẾT</th>
            <th className="text-center">GHI CHÚ</th>
            <th className="text-center">THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {editingId === product.id ? (
                <>
                  <td className="text-center">{product.stt}</td>
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
                      type="text"
                      value={editingProduct.stockType1 || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockType1: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.stockType2 || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockType2: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.project || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, project: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.unit || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
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
                  <td>
                    <input
                      type="text"
                      value={editingProduct.note || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, note: e.target.value })}
                      className="form-input"
                      style={{ padding: '5px' }}
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
                  <td className="text-center">{product.stt}</td>
                  <td>
                    <span className="badge badge-blue">{product.group}</span>
                  </td>
                  <td>{product.sku}</td>
                  <td style={{ fontWeight: '500' }}>{product.productName}</td>
                  <td>{product.stockType1 || ''}</td>
                  <td>{product.stockType2 || ''}</td>
                  <td className="text-center">{product.project || ''}</td>
                  <td className="text-center">{product.unit || ''}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(product.cost)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(product.retailPrice)}
                  </td>
                  <td>{product.note || ''}</td>
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