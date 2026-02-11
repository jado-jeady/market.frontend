export const printReceipt = (receiptHtml) => {
  const printWindow = window.open("", "_blank", "width=400,height=600");

  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            margin: 0;
            padding: 10px;
            width: 80mm;
          }

          .center {
            text-align: center;
          }

          .line {
            border-top: 1px dashed #000;
            margin: 6px 0;
          }

          table {
            width: 100%;
            font-size: 12px;
          }

          td {
            padding: 2px 0;
          }

          .right {
            text-align: right;
          }

          @page {
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${receiptHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
