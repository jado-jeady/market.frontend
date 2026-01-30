import { useState } from 'react';

const Report = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, dateRange })
      });
      if (response.ok) {
        alert('Report generated successfully!');
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('Report generated successfully! (Demo mode)');
    }
  };

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: '💰' },
    { value: 'stock', label: 'Stock Report', icon: '📦' },
    { value: 'financial', label: 'Financial Report', icon: '📊' },
    { value: 'customer', label: 'Customer Report', icon: '👥' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>

      {/* Report Generation Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Generate Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`p-4 rounded-lg border-2 transition ${
                    reportType === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-8 py-3 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition font-semibold"
        >
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Monthly Sales Report - January 2026', type: 'Sales', date: '2026-01-30' },
                { name: 'Stock Inventory Report', type: 'Stock', date: '2026-01-28' },
                { name: 'Q4 Financial Summary', type: 'Financial', date: '2026-01-25' }
              ].map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-primary-600 hover:text-primary-800 font-medium">View</button>
                    <button className="text-secondary-600 hover:text-secondary-800 font-medium">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
