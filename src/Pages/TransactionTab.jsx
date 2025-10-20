// pages/TransactionTab.jsx
import { useState, useEffect } from 'react';
import "../assets/styles/Transaction.css";
import "../assets/styles/Common.css";
import TransactionForm from '../Components/TransactionForm';
import TransactionHistory from '../Components/TransactionHistory';

function TransactionTab({
  products,
  setProducts,
  transactions,
  setTransactions,
  historyLogs,
  setHistoryLogs,
  defaultType = 'import' 
}) {
  const [transactionForm, setTransactionForm] = useState({
    productId: '',
    type: defaultType,
    quantity: 0,
    note: ''
  });

  useEffect(() => {
    setTransactionForm(prev => ({
      ...prev,
      type: defaultType
    }));
  }, [defaultType]);

  const handleTransaction = () => {
    // Validate
    if (!transactionForm.productId) {
      alert('Vui lòng chọn sản phẩm!');
      return;
    }
    
    if (!transactionForm.quantity || transactionForm.quantity <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    const product = products.find(p => p.id === Number(transactionForm.productId));
    if (!product) {
      alert('Không tìm thấy sản phẩm!');
      return;
    }

    // Kiểm tra tồn kho khi xuất
    if (transactionForm.type === 'export' && product.quantity < transactionForm.quantity) {
      alert(`Số lượng tồn kho không đủ! Hiện có: ${product.quantity}`);
      return;
    }

    // Tạo giao dịch mới
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      productId: Number(transactionForm.productId),
      type: transactionForm.type,
      quantity: Number(transactionForm.quantity),
      date: new Date().toISOString().split('T')[0],
      note: transactionForm.note
    };
    setTransactions([...transactions, newTransaction]);

    // Cập nhật tồn kho
    setProducts(products.map(p =>
      p.id === Number(transactionForm.productId)
        ? {
            ...p,
            quantity:
              transactionForm.type === 'import'
                ? p.quantity + Number(transactionForm.quantity)
                : p.quantity - Number(transactionForm.quantity)
          }
        : p
    ));

    // Thêm log lịch sử
    const newHistory = {
      id: Date.now(),
      action: transactionForm.type,
      productName: product.name,
      productSku: product.sku,
      user: 'Admin',
      details:
        transactionForm.type === 'import'
          ? `Nhập thêm ${transactionForm.quantity} sản phẩm vào kho`
          : `Xuất ${transactionForm.quantity} sản phẩm khỏi kho`,
      timestamp: new Date().toISOString()
    };
    setHistoryLogs([...historyLogs, newHistory]);

    // Reset form sau khi thành công
    setTransactionForm({
      productId: '',
      type: defaultType,
      quantity: 0,
      note: ''
    });

    alert('Nhập kho thành công!');
  };

  return (
    <div className="grid-2">
      <TransactionForm
        products={products}
        formData={transactionForm}
        onChange={setTransactionForm}
        onSubmit={handleTransaction}
      />

      <TransactionHistory 
        transactions={transactions} 
        products={products}
        filterType={defaultType} 
      />
    </div>
  );
}

export default TransactionTab;