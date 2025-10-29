import React, { useState } from 'react';
import ImportManagement from '../Components/ImportManagement';
import ExportManagement from '../Components/ExportManagement';

function TransactionForm({
  products,
  defaultType = 'import',
  currentUser,
  onTransactionComplete
}) {
  const [rows, setRows] = useState([{
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    transactionCode: '',
    summary: '',
    createdBy: currentUser?.username || '',
    sku: '',
    productId: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    reason: '',
    note: ''
  }]);

  const [processing, setProcessing] = useState(false);

  // Handle submit all valid rows
  const handleSubmitAll = async () => {
    const validRows = rows.filter(row => row.productId && row.quantity);
    
    if (validRows.length === 0) {
      alert('Vui lòng nhập ít nhất một dòng hợp lệ!');
      return;
    }

    // Validate stock for export
    if (defaultType === 'export') {
      const invalidRows = [];
      validRows.forEach((row, index) => {
        const product = products.find(p => p.id === row.productId);
        if (product && parseFloat(row.quantity) > product.quantity) {
          invalidRows.push({
            index: index + 1,
            sku: row.sku,
            requested: row.quantity,
            available: product.quantity
          });
        }
      });

      if (invalidRows.length > 0) {
        const errorMsg = invalidRows.map(r => 
          `Dòng ${r.index} (${r.sku}): Yêu cầu ${r.requested}, tồn kho ${r.available}`
        ).join('\n');
        alert(`❌ Không đủ hàng trong kho!\n\n${errorMsg}`);
        return;
      }
    }

    if (!window.confirm(`Xác nhận ${defaultType === 'import' ? 'nhập kho' : 'xuất kho'} ${validRows.length} sản phẩm?`)) {
      return;
    }

    setProcessing(true);

    try {
      // Import transactions service
      const { transactionService } = await import('../Services/TransactionServices');
      
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        
        try {
          const transactionData = {
            productId: row.productId,
            type: defaultType,
            quantity: parseFloat(row.quantity),
            transactionCode: row.transactionCode || '',
            summary: row.summary || '',
            unitPrice: parseFloat(row.unitPrice) || 0,
            note: row.note || row.reason || '',
            createdBy: row.createdBy || currentUser?.username || 'Unknown'
          };

          await transactionService.create(transactionData);
          successCount++;
        } catch (error) {
          failCount++;
          errors.push(`Dòng ${i + 1} (${row.sku}): ${error.message}`);
          console.error(`Error on row ${i + 1}:`, error);
        }
      }

      // Refresh data
      if (onTransactionComplete) {
        await onTransactionComplete();
      }

      // Show result
      let message = `✅ Hoàn tất!\n\n`;
      message += `✓ Thành công: ${successCount}\n`;
      if (failCount > 0) {
        message += `✗ Lỗi: ${failCount}\n\n`;
        message += `Chi tiết lỗi:\n${errors.slice(0, 3).join('\n')}`;
        if (errors.length > 3) {
          message += `\n... và ${errors.length - 3} lỗi khác`;
        }
      }
      alert(message);

      // Reset if all success
      if (failCount === 0) {
        setRows([{
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          transactionCode: '',
          summary: '',
          createdBy: currentUser?.username || '',
          sku: '',
          productId: '',
          productName: '',
          quantity: '',
          unitPrice: '',
          reason: '',
          note: ''
        }]);
      }

    } catch (error) {
      console.error('Error submitting transactions:', error);
      alert('Có lỗi xảy ra! Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ImportTable
        rows={rows}
        setRows={setRows}
        products={products}
        type={defaultType}
        onSubmitAll={handleSubmitAll}
        processing={processing}
      />
    </div>
  );
}

export default TransactionForm;