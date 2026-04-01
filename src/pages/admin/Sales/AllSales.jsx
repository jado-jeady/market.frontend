import { useEffect, useState } from "react";
import {
  getAllSales,
  getCashiers,
  confirmSaleReturn,
} from "../../../utils/sales.util";
import {
  Download,
  X,
  Printer,
  Receipt,
  User,
  Calendar,
  DollarSign,
  Package,
  Hash,
  Clock,
  Info,
} from "lucide-react";

const AllSales = () => {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [limit, setLimit] = useState(20);

  const [filters, setFilters] = useState({
    orderId: "",
    status: "",
    date: "",
    cashierId: "",
    shiftDate: "",
  });

  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ===================== FETCH ===================== */

  const fetchSales = async (showTableLoader = true) => {
    if (showTableLoader) setTableLoading(true);
    setLoading(true);

    const response = await getAllSales({ limit: 10000, page: 1 });
    if (response?.success) {
      setSales(response.data);
    }

    setLoading(false);
    if (showTableLoader) setTableLoading(false);
  };

  const fetchCashiers = async () => {
    const response = await getCashiers();
    if (response?.success) {
      setCashiers(response.data);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchSales(), fetchCashiers()]);
    })();
  }, []);

  /* ===================== FILTERING ===================== */

  const filteredSales = sales.filter((sale) => {
    const matchesOrderId =
      !filters.orderId || sale.invoice_number?.includes(filters.orderId);
    const matchesStatus = !filters.status || sale.status === filters.status;
    const matchesCashier =
      !filters.cashierId || sale.user?.id === Number(filters.cashierId);
    const matchesDate =
      !filters.date || sale.created_at?.slice(0, 10) === filters.date;
    const matchesShiftDate =
      !filters.shiftDate || sale.shift?.business_date === filters.shiftDate;

    return (
      matchesOrderId &&
      matchesStatus &&
      matchesCashier &&
      matchesDate &&
      matchesShiftDate
    );
  });

  const limitedSales = filteredSales.slice(0, limit);

  const totalCash = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.subtotal || 0),
    0,
  );

  /* ===================== ACTIONS ===================== */

  const openSaleDetails = (sale) => {
    // Use the already loaded sale data instead of fetching
    setSelectedSale(sale);
    setShowModal(true);
  };

  const handleReturn = async (saleId) => {
    if (!window.confirm("Confirm return for this sale?")) return;
    setTableLoading(true);
    const response = await confirmSaleReturn(saleId);
    if (response?.success) {
      await fetchSales(false); // Refresh the list after return
    }
    setTableLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      orderId: "",
      status: "",
      date: "",
      cashierId: "",
      shiftDate: "",
    });
  };

  const refreshData = async () => {
    setTableLoading(true);
    await fetchSales(false);
    setTableLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  /* ===================== UI ===================== */

  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-t animate-pulse">
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="p-6 py-2">
      {/* Header - Always visible */}
      <div className="mb-2 flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">All Sales</h3>
          <p className="text-sm text-gray-600">
            Manage and track all sales transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors self-start"
            disabled={tableLoading}
          >
            <span>Refresh</span>
            {tableLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
          </button>
          <button className="px-4 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors self-start">
            <span>
              Export All {sales.length > 0 && <span>{sales.length}</span>} Sales
            </span>
            <Download name="download" size={16} />
          </button>
        </div>
      </div>

      {/* Filters - Always visible */}
      <div className="bg-white text-gray-500 rounded-lg shadow-md p-2 mb-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          <input
            value={filters.orderId}
            onChange={(e) =>
              setFilters({ ...filters, orderId: e.target.value })
            }
            placeholder="Search Order ID"
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={filters.shiftDate}
            onChange={(e) =>
              setFilters({ ...filters, shiftDate: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Shifts</option>
            {[...new Set(sales.map((s) => s.shift?.business_date))].map(
              (date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ),
            )}
          </select>

          <select
            value={filters.cashierId}
            onChange={(e) =>
              setFilters({ ...filters, cashierId: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Cashiers</option>
            {cashiers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          />

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value={20}>Show 20</option>
            <option value={40}>Show 40</option>
            <option value={60}>Show 60</option>
            <option value={80}>Show 80</option>
            <option value={100}>Show 100</option>
            <option value={200}>Show 200</option>
          </select>

          <button
            onClick={resetFilters}
            className="h-7 bg-gray-100 text-sm rounded hover:bg-gray-200 w-full"
            disabled={tableLoading}
          >
            Reset Filters
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
          <span className="text-sm font-bold text-gray-900">
            Showing {limitedSales.length} of {filteredSales.length} sales
          </span>
          <p className="text-sm text-gray-600">
            {filters.shiftDate
              ? `Total cash for shift ${filters.shiftDate} Is : ${totalCash.toFixed(2)} frw`
              : `Total Amount Is : ${totalCash.toFixed(2)} frw`}
          </p>
        </div>
      </div>

      {/* Table with loading state */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto relative">
        {tableLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="bg-white p-3 rounded-lg shadow-lg flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-sm text-gray-600">Loading sales...</span>
            </div>
          </div>
        )}

        <table className="w-full text-xs min-w-[800px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 py-2 text-left">Order ID</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Cashier</th>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tableLoading ? (
              <TableSkeleton />
            ) : (
              limitedSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t text-gray-600 hover:bg-gray-50"
                >
                  <td className="px-2 py-2 font-semibold">
                    {sale.invoice_number}
                  </td>
                  <td className="px-2 py-2">
                    {sale.customer_name || "Walk-in"}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {sale.user?.full_name}
                  </td>
                  <td className="px-2 py-2">{sale.created_at?.slice(0, 10)}</td>
                  <td className="px-2 py-2 font-semibold">
                    {Number(sale.subtotal).toFixed(2)}
                  </td>
                  <td className="px-2 py-2">{sale.status}</td>
                  <td className="px-2 py-2 space-x-2">
                    <button
                      onClick={() => openSaleDetails(sale)}
                      className="text-green-600 hover:text-green-800"
                      disabled={tableLoading}
                    >
                      View
                    </button>
                    {sale.status === "COMPLETED" && (
                      <button
                        onClick={() => handleReturn(sale.id)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={tableLoading}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}

            {!tableLoading && limitedSales.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show more indicator */}
      {!tableLoading && filteredSales.length > limit && (
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            Showing first {limit} of {filteredSales.length} sales.
            <button
              onClick={() =>
                setLimit((prev) => Math.min(prev + 20, filteredSales.length))
              }
              className="text-blue-600 hover:text-blue-800 ml-1"
              disabled={tableLoading}
            >
              Load more
            </button>
          </p>
        </div>
      )}

      {/* Enhanced Modal with All Sale Details - Using already loaded data */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Sale Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Invoice #{selectedSale.invoice_number}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Sale Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">
                      Invoice Number
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSale.invoice_number}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      Customer
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSale.customer_name || "Walk-in Customer"}
                  </p>
                  {selectedSale.customer_phone && (
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedSale.customer_phone}
                    </p>
                  )}
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">
                      Cashier
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSale.user?.full_name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    ID: {selectedSale.user?.id}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-600">
                      Status
                    </span>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSale.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : selectedSale.status === "RETURNED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedSale.status}
                  </span>
                </div>
              </div>

              {/* Date and Shift Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">
                      Sale Information
                    </span>
                  </div>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(selectedSale.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {new Date(selectedSale.created_at).toLocaleTimeString()}
                    </p>
                    {selectedSale.updated_at !== selectedSale.created_at && (
                      <p>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {new Date(selectedSale.updated_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">
                      Shift Information
                    </span>
                  </div>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>
                      <span className="font-medium">Shift Date:</span>{" "}
                      {selectedSale.shift?.business_date || "N/A"}
                    </p>
                    <p className="text-[11px]">
                      <span className="font-medium ">Shift ID:</span>{" "}
                      {selectedSale.shift_id || "N/A"}
                    </p>
                    {selectedSale.shift?.start_time && (
                      <p>
                        <span className="font-medium">Shift Start:</span>{" "}
                        {new Date(
                          selectedSale.shift.start_time,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Discount
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSale.items?.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-xs text-gray-600">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">
                              {item.product?.name}
                            </div>
                            {item.product?.sku && (
                              <div className="text-xs text-gray-500">
                                SKU: {item.product.sku}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">
                            {Number(item.unit_price).toLocaleString()} frw
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">
                            {item.discount
                              ? `${Number(item.discount).toLocaleString()} frw`
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs font-semibold text-gray-900">
                            {(
                              item.quantity * item.unit_price -
                              (item.discount || 0)
                            ).toLocaleString()}{" "}
                            frw
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                        >
                          Subtotal:
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                          {Number(selectedSale.subtotal).toLocaleString()} frw
                        </td>
                      </tr>
                      {selectedSale.discount_amount > 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-2 text-right text-sm font-medium text-green-700"
                          >
                            Discount:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-semibold text-green-700">
                            -
                            {Number(
                              selectedSale.discount_amount,
                            ).toLocaleString()}{" "}
                            frw
                          </td>
                        </tr>
                      )}
                      {selectedSale.tax_amount > 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                          >
                            Tax:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                            {Number(selectedSale.tax_amount).toLocaleString()}{" "}
                            frw
                          </td>
                        </tr>
                      )}
                      <tr className="bg-blue-50">
                        <td
                          colSpan="5"
                          className="px-4 py-3 text-right text-base font-bold text-gray-900"
                        >
                          Total + VAT:
                        </td>
                        <td className="px-4 py-3 text-right text-base font-bold text-blue-600">
                          {Number(
                            selectedSale.total_amount || selectedSale.subtotal,
                          ).toLocaleString()}{" "}
                          frw
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Information */}
              {selectedSale.payment_method && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Payment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedSale.payment_method.toUpperCase()}
                      </span>
                    </div>
                    {selectedSale.payment_reference && (
                      <div>
                        <span className="text-gray-600">Reference:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedSale.payment_reference}
                        </span>
                      </div>
                    )}
                    {selectedSale.payment_status && (
                      <div>
                        <span className="text-gray-600">Payment Status:</span>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            selectedSale.payment_status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedSale.payment_status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedSale.notes && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-xs font-medium text-yellow-800 mb-1">
                    Notes:
                  </p>
                  <p className="text-sm text-gray-700">{selectedSale.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
              {selectedSale.status === "COMPLETED" && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleReturn(selectedSale.id);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Process Return
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSales;
