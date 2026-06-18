import React, { useState, useEffect } from "react";
import {
  Search,
  Printer,
  CheckCircle,
  Clock,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { getBaristaSales } from "../../utils/sales.util";
import { toast } from "react-toastify";

export default function BaristaSales() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refundOrder, setRefundOrder] = useState(null); // for refund modal

  // Fetch sales from backend
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getBaristaSales();
      if (response?.success) {
        setOrders(response.data);
      } else {
        toast.error(response?.message || "Failed to fetch barista sales");
      }
    } catch (error) {
      console.error("Error fetching barista sales:", error);
      toast.error("An error occurred while fetching barista sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  // Filter orders by search and date
  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();

    const invoiceMatch = String(order.invoice_number || "")
      .toLowerCase()
      .includes(searchLower);
    const idMatch = String(order.id || "")
      .toLowerCase()
      .includes(searchLower);

    const productMatch = Array.isArray(order.items)
      ? order.items.some(
          (item) =>
            String(item.product_name || "")
              .toLowerCase()
              .includes(searchLower) ||
            String(item.barcode || "")
              .toLowerCase()
              .includes(searchLower),
        )
      : false;

    const dateMatch = dateFilter
      ? new Date(order.created_at).toISOString().slice(0, 10) === dateFilter
      : true;

    return (invoiceMatch || idMatch || productMatch) && dateMatch;
  });

  return (
    <div className="min-h-screen bg-[#120b06] flex flex-col overflow-hidden text-gray-800 text-xs p-1">
      <div className="bg-[#120b06] border  rounded-2xl p-2 flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 shrink-0">
          <div>
            <h2 className="text-base text-[#c8924a]  font-black">
              Order Sales Journal
            </h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Review and manage daily customer tabs
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by ID, product, barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black text-[11px]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
            {/* Date Filter */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-40 pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black text-[11px]"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Scrollable Orders List Layout */}
        <div className="flex-1 overflow-y-auto mt-3 w-full space-y-2 pr-1 min-h-0">
          {loading ? (
            <p className="text-center text-gray-500 text-xs">
              Loading sales...
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 text-xs">No sales found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-black text-[11px] text-gray-900">
                        {order.invoice_number}
                      </span>
                      <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-md font-bold">
                        Sale #{order.id}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {order.customer_name}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium text-[11px] truncate">
                      {Array.isArray(order.items)
                        ? order.items
                            .map(
                              (item) =>
                                `${item.quantity}x ${item.product_name}`,
                            )
                            .join(", ")
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-right">
                      <span className="block font-black text-gray-900 text-[11px]">
                        {Number(order.total_amount || 0).toLocaleString()} RWF
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase ${
                          order.status === "COMPLETED"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {order.status === "COMPLETED" ? (
                          <CheckCircle size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* Reprint KOT */}
                      <button className="p-2 bg-white border border-gray-200 hover:border-black rounded-lg transition-all active:scale-95">
                        <Printer size={13} className="text-gray-700" />
                      </button>
                      {/* Refund */}
                      <button
                        onClick={() => setRefundOrder(order)}
                        className="px-3 py-1.5 text-[10px] font-semibold text-white bg-[#120b06] rounded-lg hover:bg-red-700 transition"
                      >
                        Refund
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Refund Modal */}
      {refundOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-base font-bold mb-3">
              Refund Sale #{refundOrder.id}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to refund this sale? This will mark the sale
              as refunded and adjust totals accordingly.
            </p>

            {/* Show quick summary of items */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-700 max-h-40 overflow-y-auto">
              {Array.isArray(refundOrder.items) &&
                refundOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-1"
                  >
                    <span>{item.product_name}</span>
                    <span>
                      {item.quantity} ×{" "}
                      {Number(item.unit_price).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRefundOrder(null)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: call refund API here
                  toast.success(
                    `Sale #${refundOrder.id} refunded successfully`,
                  );
                  setRefundOrder(null);
                }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
