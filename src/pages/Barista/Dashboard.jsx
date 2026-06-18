import React, { useState, useEffect } from "react";
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
import { getBaristaSales } from "../../utils/sales.util";
import { getShiftSummary } from "../../utils/shift.util";
import { toast } from "react-toastify";

export default function BaristaDashboard() {
  const [liveOrders, setLiveOrders] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    avgWaitTime: "—",
    shiftTarget: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const salesRes = await getBaristaSales();
      const shiftRes = await getShiftSummary();

      if (salesRes?.success) {
        const orders = salesRes.data;
        setStats((prev) => ({
          ...prev,
          revenue: orders.reduce(
            (sum, o) => sum + Number(o.total_amount || 0),
            0,
          ),
          ordersCount: orders.length,
        }));
      }

      if (shiftRes?.success) {
        const summary = shiftRes.data;
        setStats((prev) => ({
          ...prev,
          avgWaitTime: summary.avg_wait_time || "—",
          shiftTarget: summary.shift_progress || 0,
        }));
      }
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  // Fetch live orders
  const fetchLiveOrders = async () => {
    try {
      const res = await fetch("/api/live-orders");
      const data = await res.json();
      setLiveOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching live orders:", err);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/event-stream");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLiveOrders();
    fetchLogs();

    const intervalOrders = setInterval(fetchLiveOrders, 10000);
    const intervalLogs = setInterval(fetchLogs, 15000);
    return () => {
      clearInterval(intervalOrders);
      clearInterval(intervalLogs);
    };
  }, []);

  const handleCompleteOrder = (id) => {
    setLiveOrders((prev) => prev.filter((order) => order.id !== id));
    // TODO: backend call to mark order complete
  };

  return (
    <div className="h-screen w-full bg-gray-100 pt-12 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      {/* ── HEADER TELEMETRY ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 mb-3">
        {/* Revenue */}
        <StatCard
          label="Shift Revenue"
          value={`${stats.revenue.toLocaleString()} Frw`}
          icon={<DollarSign className="w-4 h-4 text-gray-900" />}
        />
        {/* Orders */}
        <StatCard
          label="Tickets Closed"
          value={`${stats.ordersCount} Invoices`}
          icon={<Coffee className="w-4 h-4 text-gray-900" />}
        />
        {/* Avg Wait */}
        <StatCard
          label="Avg Velocity"
          value={stats.avgWaitTime}
          icon={<Clock className="w-4 h-4 text-gray-900" />}
        />
        {/* Quota */}
        <QuotaCard progress={stats.shiftTarget} />
      </div>

      {/* ── CORE CONTENT ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
        {/* LEFT: Live Orders */}
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

                  {/* Items */}
                  <ul className="space-y-1 pl-1 mb-4 font-semibold text-[11px] text-gray-700">
                    {Array.isArray(order.items) &&
                      order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                          {item.product_name
                            ? `${item.quantity}x ${item.product_name}`
                            : item}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Actions */}
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

        {/* RIGHT: Event Stream */}
        <div className="w-full lg:w-64 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col overflow-hidden shrink-0">
          <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2.5 shrink-0">
            <Activity size={13} className="text-gray-400" />
            <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
              Real-Time Event Stream
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 min-h-0 pr-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className="flex gap-2 items-start text-[10px] font-semibold border-b border-gray-50 pb-2 last:border-none"
              >
                <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded font-mono shrink-0">
                  {new Date(log.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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

            {logs.length === 0 && (
              <p className="text-center text-gray-400 text-[10px]">
                No recent events
              </p>
            )}
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

/* ── Small helper components for cleaner JSX ── */
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm font-black text-gray-900">{value}</span>
      </div>
      <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
        {icon}
      </div>
    </div>
  );
}

function QuotaCard({ progress }) {
  return (
    <div className="bg-white border border-gray-200 p-3 rounded-2xl flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
          Quota Performance
        </span>
        <span className="font-black text-gray-900 text-[10px]">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-black h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
