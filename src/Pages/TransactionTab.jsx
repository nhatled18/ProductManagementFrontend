// pages/TransactionTab.jsx
import { useState, useEffect } from 'react';
import "../assets/styles/Transaction.css";
import "../assets/styles/Common.css";
import TransactionForm from '../Components/TransactionForm';
import TransactionHistory from '../Components/TransactionHistory';
import { transactionService } from '../Services/TransactionServices';
// import { productService } from '../Services/ProductServices';

function TransactionTab({
  products,
  setProducts,
  transactions,
  setTransactions,
  historyLogs,
  setHistoryLogs,
  defaultType = 'import',
  onTransactionComplete // Callback từ Dashboard để refresh data
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

  const handleTransaction = async () => {
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

    try {
      // Tạo transaction qua API
      const transactionData = {
        productId: Number(transactionForm.productId),
        type: transactionForm.type,
        quantity: Number(transactionForm.quantity),
        note: transactionForm.note
      };

      const response = await transactionService.create(transactionData);

      // Update local state với data từ server
      setTransactions([...transactions, response.data]);

      // Cập nhật tồn kho local (hoặc refresh từ server)
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

      // Gọi callback để refresh tất cả data từ Dashboard
      if (onTransactionComplete) {
        await onTransactionComplete();
      }

      // Reset form sau khi thành công
      setTransactionForm({
        productId: '',
        type: defaultType,
        quantity: 0,
        note: ''
      });

      alert(
        transactionForm.type === 'import' 
          ? 'Nhập kho thành công!' 
          : 'Xuất kho thành công!'
      );

    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Có lỗi xảy ra! Vui lòng thử lại.');
    }
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