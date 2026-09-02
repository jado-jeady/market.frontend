// components/Reports/Report.jsx
import { useState, useEffect } from "react";
import {
  generateSalesReport,
  generateStockReport,
  generateFinancialReport,
  generateCustomerReport,
  generateCategoryReport,
  downloadReportExcel,
  getAllReports,
} from "../../utils/report.util";
import { toast } from "react-toastify";
import {
  Loader2,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  PieChart,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";

const Report = () => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [fetchingReports, setFetchingReports] = useState(false);
  const [reportName, setReportName] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: TrendingUp, color: "blue" },
    { value: "stock", label: "Stock Report", icon: Package, color: "green" },
    {
      value: "financial",
      label: "Financial Report",
      icon: DollarSign,
      color: "violet",
    },
    {
      value: "customer",
      label: "Customer Report",
      icon: Users,
      color: "orange",
    },
    {
      value: "category",
      label: "Category Report",
      icon: PieChart,
      color: "red",
    },
  ];

  const generateFunctions = {
    sales: generateSalesReport,
    stock: generateStockReport,
    financial: generateFinancialReport,
    customer: generateCustomerReport,
    category: generateCategoryReport,
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setFetchingReports(true);
    try {
      const response = await getAllReports({ limit: 100 });
      if (response.success) {
        setReports(response.data);
      } else {
        toast.error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Error fetching reports");
    } finally {
      setFetchingReports(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }

    setLoading(true);
    try {
      const generateFn = generateFunctions[reportType];
      const response = await generateFn({
        reportName,
        dateRange,
      });

      if (response.success) {
        toast.success(
          `${response.message || "Report generated successfully!"}`,
        );
        await fetchReports();
        // Reset form
        setReportName("");
        setDateRange({
          from: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
          to: new Date().toISOString().split("T")[0],
        });
      } else {
        toast.error(response.message || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const result = await downloadReportExcel(reportId);
      if (result.success) {
        toast.success("Report downloaded successfully!");
        await fetchReports();
      } else {
        toast.error("Failed to download report");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Error downloading report");
    }
  };

  const handleViewReport = async (report) => {
    setSelectedReport(report);
    console.log("Selected report for viewing summary:", selectedReport.summary);
    setShowReportModal(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      generated: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      downloaded: { color: "bg-blue-100 text-blue-700", icon: Download },
      failed: { color: "bg-red-100 text-red-700", icon: XCircle },
    };
    const { color, icon: Icon } = config[status] || config.generated;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h3>
            <p className="text-sm text-gray-500">
              Generate and manage business reports
            </p>
          </div>
          <button
            onClick={fetchReports}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Report Generation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">
            Generate New Report
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Report Type Selection */}
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = reportType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `border-${type.color}-500 bg-${type.color}-50 shadow-sm`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected
                            ? `text-${type.color}-600`
                            : "text-gray-400"
                        }`}
                      />
                      <div
                        className={`text-xs font-medium ${
                          isSelected
                            ? `text-${type.color}-700`
                            : "text-gray-600"
                        }`}
                      >
                        {type.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range & Name */}
            <div className="lg:col-span-5 text-sm text-gray-700 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Monthly Sales Report - Jan 2026"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="lg:col-span-3 flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading || !reportName.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 inline mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              Recent Reports
            </h4>
            <span className="text-sm text-gray-500">
              {reports.length} reports
            </span>
          </div>

          {fetchingReports ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports generated yet</p>
              <p className="text-sm text-gray-400">
                Generate your first report above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Generated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report) => {
                    const reportTypeInfo = reportTypes.find(
                      (t) => t.value === report.report_type,
                    );
                    const Icon = reportTypeInfo?.icon || FileText;

                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {report.report_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-${reportTypeInfo?.color || "gray"}-100 text-${reportTypeInfo?.color || "gray"}-700`}
                          >
                            {reportTypeInfo?.label || report.report_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {report.generatedBy?.full_name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewReport(report)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(report.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h5 className="text-lg font-bold text-gray-900">
                  {selectedReport.report_name}
                </h5>
                <p className="text-sm text-gray-500">
                  Generated on{" "}
                  {new Date(selectedReport.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Section */}
              {selectedReport.summary && (
                <div>
                  <h6 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Summary
                  </h6>

                  {/* Render different summary types based on report type */}
                  <div className="space-y-6">
                    {/* For Financial Report */}
                    {selectedReport.report_type === "financial" && (
                      <>
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                              Total Revenue
                            </p>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              {selectedReport.summary.total_revenue?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                              Total VAT
                            </p>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              {selectedReport.summary.total_vat?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                              Total Transactions
                            </p>
                            <p className="text-lg font-bold text-purple-900 mt-1">
                              {selectedReport.summary.total_transactions}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <p className="text-xs text-orange-600 uppercase tracking-wider font-semibold">
                              Average Transaction
                            </p>
                            <p className="text-lg font-bold text-orange-900 mt-1">
                              {selectedReport.summary.average_transaction?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                        </div>

                        {/* Net Revenue & Discounts */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                            <p className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">
                              Net Revenue
                            </p>
                            <p className="text-lg font-bold text-emerald-900 mt-1">
                              {selectedReport.summary.net_revenue?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <p className="text-xs text-red-600 uppercase tracking-wider font-semibold">
                              Total Discounts
                            </p>
                            <p className="text-lg font-bold text-red-900 mt-1">
                              {selectedReport.summary.total_discounts?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                        </div>

                        {/* Top Cashiers */}
                        {selectedReport.summary.top_cashiers &&
                          selectedReport.summary.top_cashiers.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                Top Cashiers
                              </h6>
                              <div className="space-y-2">
                                {selectedReport.summary.top_cashiers.map(
                                  (cashier, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {cashier.name}
                                      </span>
                                      <div className="flex gap-4 text-sm">
                                        <span className="text-gray-500">
                                          {cashier.transactions} transactions
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          {cashier.revenue?.toLocaleString()}{" "}
                                          RWF
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Daily Revenue */}
                        {selectedReport.summary.daily_revenue &&
                          Object.keys(selectedReport.summary.daily_revenue)
                            .length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                Daily Revenue Breakdown
                              </h6>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                {Object.entries(
                                  selectedReport.summary.daily_revenue,
                                ).map(([date, amount]) => (
                                  <div
                                    key={date}
                                    className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100 text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {date}
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                      {typeof amount === "number"
                                        ? amount.toLocaleString()
                                        : amount}{" "}
                                      RWF
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    )}

                    {/* For Sales Report */}
                    {selectedReport.report_type === "sales" && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                              Total Sales
                            </p>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              {selectedReport.summary.total_sales}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                              Total Revenue
                            </p>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              {selectedReport.summary.total_revenue?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                              Average Order
                            </p>
                            <p className="text-lg font-bold text-purple-900 mt-1">
                              {selectedReport.summary.average_order_value?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        {selectedReport.summary.payment_methods && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                              Payment Methods
                            </h6>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(
                                selectedReport.summary.payment_methods,
                              ).map(([method, count]) => (
                                <div
                                  key={method}
                                  className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100"
                                >
                                  <span className="font-medium text-gray-900">
                                    {method}
                                  </span>
                                  <span className="text-sm font-semibold text-blue-600">
                                    {count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* For Stock Report */}
                    {selectedReport.report_type === "stock" && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                              Total Products
                            </p>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              {selectedReport.summary.total_products}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                              Stock Value
                            </p>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              {selectedReport.summary.total_stock_value?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                            <p className="text-xs text-yellow-600 uppercase tracking-wider font-semibold">
                              Low Stock
                            </p>
                            <p className="text-lg font-bold text-yellow-900 mt-1">
                              {selectedReport.summary.low_stock_items}
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <p className="text-xs text-red-600 uppercase tracking-wider font-semibold">
                              Out of Stock
                            </p>
                            <p className="text-lg font-bold text-red-900 mt-1">
                              {selectedReport.summary.out_of_stock_items}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* For Customer Report */}
                    {selectedReport.report_type === "customer" && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                              Total Customers
                            </p>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              {selectedReport.summary.total_customers}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                              Total Spent
                            </p>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              {selectedReport.summary.total_customer_spent?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                              Average Spent
                            </p>
                            <p className="text-lg font-bold text-purple-900 mt-1">
                              {selectedReport.summary.average_customer_spent?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                        </div>

                        {/* Top Customers */}
                        {selectedReport.summary.top_customers &&
                          selectedReport.summary.top_customers.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                Top Customers
                              </h6>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {selectedReport.summary.top_customers.map(
                                  (customer, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100"
                                    >
                                      <div>
                                        <span className="font-medium text-gray-900">
                                          {customer.name}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                          {customer.phone}
                                        </span>
                                      </div>
                                      <div className="flex gap-4 text-sm">
                                        <span className="text-gray-500">
                                          {customer.total_transactions}{" "}
                                          purchases
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          {customer.total_spent?.toLocaleString()}{" "}
                                          RWF
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    )}

                    {/* For Category Report */}
                    {selectedReport.report_type === "category" && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                              Total Categories
                            </p>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              {selectedReport.summary.total_categories}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                              Total Revenue
                            </p>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              {selectedReport.summary.total_revenue?.toLocaleString()}{" "}
                              RWF
                            </p>
                          </div>
                          {selectedReport.summary.top_category && (
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                              <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                                Top Category
                              </p>
                              <p className="text-lg font-bold text-purple-900 mt-1">
                                {selectedReport.summary.top_category.name}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Category Breakdown */}
                        {selectedReport.summary.categories &&
                          selectedReport.summary.categories.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                Category Breakdown
                              </h6>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {selectedReport.summary.categories.map(
                                  (category, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {category.name}
                                      </span>
                                      <div className="flex gap-4 text-sm">
                                        <span className="text-gray-500">
                                          {category.total_items} items
                                        </span>
                                        <span className="text-gray-500">
                                          {category.total_sales} sales
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          {category.total_revenue?.toLocaleString()}{" "}
                                          RWF
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {reportTypes.find(
                      (t) => t.value === selectedReport.report_type,
                    )?.label || selectedReport.report_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Date Range
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReport.date_range_from} →{" "}
                    {selectedReport.date_range_to}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Status</p>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Generated By
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReport.generatedBy?.full_name || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDownloadReport(selectedReport.id)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                >
                  <Download className="w-4 h-4" />
                  Download Excel
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
