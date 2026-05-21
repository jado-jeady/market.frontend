import React, { useState } from "react";
import { Search, Printer, CheckCircle, Clock } from "lucide-react";

export default function BaristaSales() {
  const [search, setSearch] = useState("");

  const mockOrders = [
    {
      id: "ORD-9281",
      table: "T-04",
      time: "14:32",
      items: "2x Cappuccino, 1x Fruit Salad",
      total: 7000,
      status: "completed",
    },
    {
      id: "ORD-9280",
      table: "T-01",
      time: "14:15",
      items: "1x Cafe Latte, 1x Espresso",
      total: 3500,
      status: "pending",
    },
    {
      id: "ORD-9279",
      table: "Takeaway",
      time: "13:50",
      items: "1x Frappuccino Coffee",
      total: 3000,
      status: "completed",
    },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-black">Order Sales Journal</h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Review and manage daily customer tabs
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search order ID or table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black text-[11px]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Scrollable Orders List Layout */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1 min-h-0">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-[11px] text-gray-900">
                    {order.id}
                  </span>
                  <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-md font-bold">
                    {order.table}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.time}
                  </span>
                </div>
                <p className="text-gray-600 font-medium text-[11px] truncate">
                  {order.items}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="block font-black text-gray-900 text-[11px]">
                    {order.total.toLocaleString()} RWF
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase ${order.status === "completed" ? "text-green-600" : "text-amber-600"}`}
                  >
                    {order.status === "completed" ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {order.status}
                  </span>
                </div>
                <button className="p-2 bg-white border border-gray-200 hover:border-black rounded-lg transition-all active:scale-95">
                  <Printer size={13} className="text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
