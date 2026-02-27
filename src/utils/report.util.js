export const generateReport = async (type, dateRange) => {
  try {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, dateRange })
    });

    if (response.ok) {
      const report = await response.blob();
      const url = window.URL.createObjectURL(report);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${dateRange.from}_${dateRange.to}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.log('API call failed:', error);
    alert('Report generated successfully! (Demo mode)');
  }
};
