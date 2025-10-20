// pages/TransactionTab.jsx
import { useState } from 'react';
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

  const handleTransaction = () => {
    const product = products.find(p => p.id === Number(transactionForm.productId));
    if (!product) return alert('Không tìm thấy sản phẩm!');

    if (transactionForm.type === 'export' && product.quantity < transactionForm.quantity) {
      alert('Số lượng tồn kho không đủ!');
      return;
    }

    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      productId: Number(transactionForm.productId),
      type: transactionForm.type,
      quantity: Number(transactionForm.quantity),
      date: new Date().toISOString().split('T')[0],
      note: transactionForm.note
    };
    setTransactions([...transactions, newTransaction]);

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

    // ✅ Ghi lịch sử vào HistoryTab
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
    setHistoryLogs([...historyLogs, newHistory]); // ✅ cập nhật history chung

    setTransactionForm({ productId: '', type: defaultType, quantity: 0, note: '' });
    alert('Giao dịch thành công!');
  };

  return (
    <div className="grid-2">
      <TransactionForm
        products={products}
        formData={transactionForm}
        onChange={setTransactionForm}
        onSubmit={handleTransaction}
      />

      <TransactionHistory transactions={transactions} products={products} />
    </div>
  );
}

export default TransactionTab;
