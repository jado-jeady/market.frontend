import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Clock,
  Coffee,
  CheckCircle,
  Activity,
  ChevronRight,
  AlertCircle,
  Timer,
} from "lucide-react";

export default function BaristaDashboard() {
  // Live mutable state for active dashboard order cards queue
  const [liveOrders, setLiveOrders] = useState([
    {
      id: "ORD-9284",
      table: "Table 4",
      time: "3 mins ago",
      items: ["2x Cappuccino", "1x Fruit Salad"],
      status: "Preparing",
      critical: false,
    },
    {
      id: "ORD-9285",
      table: "Table 1",
      time: "8 mins ago",
      items: ["1x Espresso", "1x Frappuccino"],
      status: "Pending",
      critical: true,
    },
    {
      id: "ORD-9286",
      table: "Takeaway",
      time: "Just now",
      items: ["1x Cafe Latte (Oat Milk)"],
      status: "Pending",
      critical: false,
    },
  ]);

  // Daily system stats markers
  const stats = useMemo(
    () => ({
      revenue: 142500,
      ordersCount: 64,
      avgWaitTime: "4.5 min",
      shiftTarget: 75, // Percentage metrics indicator
    }),
    [],
  );

  // Handler to clear/complete orders on a quick click layout trigger
  const handleCompleteOrder = (id) => {
    setLiveOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <div className="h-screen w-full bg-gray-100 pt-12 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      {/* ── HEADER TELEMETRY ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 mb-3">
        {/* Stat 1: Revenue */}
        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
              Shift Revenue
            </span>
            <span className="text-sm font-black text-gray-900">
              {stats.revenue.toLocaleString()} Frw
            </span>
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
            <DollarSign className="w-4 h-4 text-gray-900" />
          </div>
        </div>

        {/* Stat 2: Orders Count */}
        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
              Tickets Closed
            </span>
            <span className="text-sm font-black text-gray-900">
              {stats.ordersCount} Invoices
            </span>
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
            <Coffee className="w-4 h-4 text-gray-900" />
          </div>
        </div>

        {/* Stat 3: Processing Speed */}
        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
              Avg Velocity
            </span>
            <span className="text-sm font-black text-gray-900">
              {stats.avgWaitTime}
            </span>
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
            <Clock className="w-4 h-4 text-gray-900" />
          </div>
        </div>

        {/* Stat 4: Shift Progress Indicator */}
        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
              Quota Performance
            </span>
            <span className="font-black text-gray-900 text-[10px]">
              {stats.shiftTarget}%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-black h-full rounded-full"
              style={{ width: `${stats.shiftTarget}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── DUAL COLUMN CORE CONTENT FIELD ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
        {/* LEFT COMPONENT: LIVE ACTIVE BAR TICKETS QUEUE */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
            <div>
              <h2 className="text-base font-black">Live Production Board</h2>
              <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
                Fulfill items from pending order sockets
              </p>
            </div>
            <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              {liveOrders.length} active tabs
            </span>
          </div>

          {/* Grid Layout of active dynamic task blocks */}
          <div className="flex-1 overflow-y-auto mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 content-start min-h-0 pr-1">
            {liveOrders.map((order) => (
              <div
                key={order.id}
                className={`border rounded-xl p-3 flex flex-col justify-between transition-all bg-gray-50/50 ${
                  order.critical
                    ? "border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.08)]"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-gray-900 text-[11px]">
                        {order.id}
                      </span>
                      <span className="bg-black text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                        {order.table}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                      <Timer
                        size={10}
                        className={
                          order.critical ? "text-amber-500 animate-spin" : ""
                        }
                      />
                      <span>{order.time}</span>
                    </div>
                  </div>

                  {/* Recipe / Order specifics lists array */}
                  <ul className="space-y-1 pl-1 mb-4 font-semibold text-[11px] text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive State Mutation Actions Trigger button element */}
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="w-full py-1.5 bg-white border border-gray-200 hover:border-black text-gray-900 font-black rounded-lg transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                >
                  <CheckCircle size={12} className="text-green-600" />
                  <span>Mark Served</span>
                </button>
              </div>
            ))}

            {liveOrders.length === 0 && (
              <div className="col-span-full h-40 flex flex-col items-center justify-center text-center text-gray-400 font-medium">
                <CheckCircle size={24} className="text-gray-300 mb-1" />
                <p>All clear! Fulfillments sequence completely empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: TELEMETRY ACTIVITY AUDIT LOG TICKER */}
        <div className="w-full lg:w-64 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col overflow-hidden shrink-0">
          <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2.5 shrink-0">
            <Activity size={13} className="text-gray-400" />
            <div>
              <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                Real-Time Event Stream
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-3 min-h-0 pr-1">
            {[
              {
                time: "16:44",
                text: "Stock alert: 'Full Cream Milk' fell below minimum safe balance threshold.",
                type: "warning",
              },
              {
                time: "16:32",
                text: "Z-Report diagnostic simulation script triggered via BARISTA-STATION-01.",
                type: "info",
              },
              {
                time: "16:21",
                text: "Account registration request initialized for client David Mugisha.",
                type: "info",
              },
              {
                time: "16:15",
                text: "Invoice entry ORD-9281 cleared with print receipt verification successfully completed.",
                type: "success",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex gap-2 items-start text-[10px] font-semibold border-b border-gray-50 pb-2 last:border-none"
              >
                <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded font-mono shrink-0">
                  {log.time}
                </span>
                <p className="text-gray-600 leading-snug flex-1">
                  {log.type === "warning" && (
                    <AlertCircle
                      size={10}
                      className="inline text-red-500 mr-1 align-middle"
                    />
                  )}
                  {log.text}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Route Shortcut Button panel link */}
          <div className="pt-2 border-t border-gray-100 shrink-0 mt-auto">
            <a
              href="/barista/sales"
              className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors group"
            >
              <span>View full sales logs ledger</span>
              <ChevronRight
                size={12}
                className="text-gray-400 group-hover:text-black transition-colors"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
