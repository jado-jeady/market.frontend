import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Loader2,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Receipt,
  Users,
  ArrowLeftRight,
  ShoppingBag,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  getSalesReport,
  getProfitReport,
  getVatReport,
  getShiftReport,
  getStockMovementReport,
  getPurchaseReport,
} from "../../utils/report.util";

/* ============================================================
   DATE HELPERS
============================================================ */
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const TABS = [
  { key: "sales", label: "Sales", icon: TrendingUp },
  { key: "profit", label: "Profit", icon: DollarSign },
  { key: "vat", label: "VAT", icon: Receipt },
  { key: "shifts", label: "Shifts", icon: Users },
  { key: "movements", label: "Stock Movements", icon: ArrowLeftRight },
  { key: "purchases", label: "Purchases", icon: ShoppingBag },
];

const Reports = () => {
  const [tab, setTab] = useState("sales");
  const [from, setFrom] = useState(daysAgo(30));
  const [to, setTo] = useState(today());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setData(null);
    try {
      let res;
      if (tab === "sales")
        res = await getSalesReport({ from, to, group_by: "day" });
      else if (tab === "profit") res = await getProfitReport({ from, to });
      else if (tab === "vat") res = await getVatReport({ from, to });
      else if (tab === "shifts") res = await getShiftReport({ from, to });
      else if (tab === "movements")
        res = await getStockMovementReport({ from, to, limit: 500 });
      else if (tab === "purchases") res = await getPurchaseReport({ from, to });

      if (res?.success) {
        setData(res.data ?? res);
      } else {
        toast.error("Failed to load report");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [tab, from, to]);

  /* Excel export */
  const handleExport = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    const suffix = `${from}_to_${to}`;

    if (tab === "sales") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([data.summary]),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.series),
        "By Day",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_payment),
        "By Payment",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_cashier),
        "By Cashier",
      );
    } else if (tab === "profit") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([data.summary]),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_product),
        "By Product",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_batch),
        "By Batch",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_day),
        "By Day",
      );
    } else if (tab === "vat") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([data.summary]),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_category),
        "By Category",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_day),
        "By Day",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_product),
        "By Product",
      );
    } else if (tab === "shifts") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([data.summary]),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.shifts),
        "Shifts",
      );
    } else if (tab === "movements") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.summary.by_type),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.top_movers),
        "Top Movers",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.data),
        "Movements",
      );
    } else if (tab === "purchases") {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([data.summary]),
        "Summary",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_product),
        "By Product",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_supplier),
        "By Supplier",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data.by_day),
        "By Day",
      );
    }

    XLSX.writeFile(wb, `${tab}-report-${suffix}.xlsx`);
  };

  return (
    <div className="p-3 md:p-5 text-gray-900 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Reports
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Live business reports — always up-to-date
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-gray-600 items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-900" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-xs border-none text-gray-900 outline-none bg-transparent"
            />
            <span className="text-gray-300">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-xs border-none text-gray-900 outline-none bg-transparent"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={!data || loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  active
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
          <p className="text-xs text-gray-400 uppercase font-black tracking-widest">
            Loading {tab} report...
          </p>
        </div>
      ) : !data ? (
        <div className="text-center py-20 text-gray-400">
          No data. Adjust the date range.
        </div>
      ) : (
        <>
          {tab === "sales" && <SalesReport data={data} />}
          {tab === "profit" && <ProfitReport data={data} />}
          {tab === "vat" && <VatReport data={data} />}
          {tab === "shifts" && <ShiftReport data={data} />}
          {tab === "movements" && <MovementsReport data={data} />}
          {tab === "purchases" && <PurchasesReport data={data} />}
        </>
      )}
    </div>
  );
};

/* ============================================================
   REUSABLE PIECES
============================================================ */
const Card = ({
  label,
  value,
  sub,
  color = "text-gray-900",
  bg = "bg-white",
}) => (
  <div className={`${bg} rounded-2xl shadow-sm border border-gray-100 p-4`}>
    <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1">
      {label}
    </p>
    <p className={`text-xl font-black ${color} truncate`}>{value}</p>
    {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
  </div>
);

const rwf = (n) => `${Number(n || 0).toLocaleString()} RWF`;

const SimpleTable = ({ columns, rows, emptyText = "No data" }) => {
  if (!rows || rows.length === 0)
    return (
      <div className="text-center py-10 text-gray-400 text-xs italic">
        {emptyText}
      </div>
    );
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b">
          <tr className="text-[10px] text-gray-500 uppercase font-black">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 ${
                  c.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/20">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-4 py-2.5 ${
                    c.align === "right" ? "text-right" : "text-left"
                  } ${c.className || ""}`}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ============================================================
   SALES TAB
============================================================ */
/* ============================================================
   SALES TAB
============================================================ */
const SalesReport = ({ data }) => {
  // Extract the underlying report metrics safely from the payload wrapper
  const reportData = data?.data || data;

  if (!reportData?.summary) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card
          label="Transactions"
          value={reportData.summary.total_transactions}
        />
        <Card
          label="Revenue"
          value={rwf(reportData.summary.total_revenue)}
          color="text-emerald-600"
        />
        <Card
          label="VAT"
          value={rwf(reportData.summary.total_vat)}
          color="text-blue-600"
        />
        <Card
          label="Avg Order"
          value={rwf(reportData.summary.average_order)}
          color="text-purple-600"
        />
      </div>

      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider pt-2">
        Daily Breakdown
      </h3>
      <SimpleTable
        columns={[
          { key: "period", label: "Period" },
          { key: "count", label: "Txns", align: "right" },
          {
            key: "vat",
            label: "VAT",
            align: "right",
            render: (r) => rwf(r.vat),
          },
          {
            key: "revenue",
            label: "Revenue",
            align: "right",
            render: (r) => rwf(r.revenue),
          },
        ]}
        rows={reportData.series || []}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
            By Payment Method
          </h3>
          <SimpleTable
            columns={[
              {
                key: "method",
                label: "Method",
                render: (r) => r.payment_method || r.method,
              },
              { key: "count", label: "Count", align: "right" },
              {
                key: "revenue",
                label: "Revenue",
                align: "right",
                render: (r) => rwf(r.revenue),
              },
            ]}
            rows={(reportData.by_payment || []).map((p, i) => ({
              ...p,
              id: i,
            }))}
          />
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
            By Cashier
          </h3>
          <SimpleTable
            columns={[
              { key: "name", label: "Cashier" },
              { key: "count", label: "Count", align: "right" },
              {
                key: "revenue",
                label: "Revenue",
                align: "right",
                render: (r) => rwf(r.revenue),
              },
            ]}
            rows={reportData.by_cashier || []}
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PROFIT TAB
============================================================ */
const ProfitReport = ({ data }) => {
  const [view, setView] = useState("product");

  // Extract the underlying report metrics safely from the payload wrapper
  const reportData = data?.data || data;

  // Safe guard clause: prevents crash if state holds structural data from another tab
  if (!reportData?.summary || !("total_profit" in reportData.summary)) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading profit metrics...
      </div>
    );
  }

  const rows =
    view === "product"
      ? reportData.by_product || []
      : view === "batch"
        ? reportData.by_batch || []
        : reportData.by_day || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card
          label="Revenue"
          value={rwf(reportData.summary.total_revenue)}
          color="text-gray-900"
        />
        <Card
          label="Cost"
          value={rwf(reportData.summary.total_cost)}
          color="text-orange-600"
        />
        <Card
          label="Profit"
          value={rwf(reportData.summary.total_profit)}
          color={
            reportData.summary.total_profit >= 0
              ? "text-emerald-600"
              : "text-red-600"
          }
        />
        <Card
          label="Margin %"
          value={`${reportData.summary.profit_margin_pct}%`}
          color="text-blue-600"
        />
        <Card
          label="Loss Lines"
          value={reportData.summary.loss_lines}
          color="text-red-600"
        />
      </div>

      <div className="flex gap-2">
        {[
          { key: "product", label: "By Product" },
          { key: "batch", label: "By Batch" },
          { key: "day", label: "By Day" },
        ].map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
              view === v.key
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "product" && (
        <SimpleTable
          columns={[
            { key: "name", label: "Product" },
            { key: "quantity_sold", label: "Qty", align: "right" },
            {
              key: "revenue",
              label: "Revenue",
              align: "right",
              render: (r) => rwf(r.revenue),
            },
            {
              key: "cost",
              label: "Cost",
              align: "right",
              render: (r) => rwf(r.cost),
            },
            {
              key: "profit",
              label: "Profit",
              align: "right",
              render: (r) => (
                <span
                  className={
                    r.profit >= 0
                      ? "text-emerald-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {rwf(r.profit)}
                </span>
              ),
            },
            {
              key: "profit_margin_pct",
              label: "Margin %",
              align: "right",
              render: (r) => `${r.profit_margin_pct}%`,
            },
          ]}
          rows={rows}
        />
      )}

      {view === "batch" && (
        <SimpleTable
          columns={[
            { key: "product_name", label: "Product" },
            { key: "batch_code", label: "Batch" },
            { key: "quantity_sold", label: "Qty", align: "right" },
            {
              key: "revenue",
              label: "Revenue",
              align: "right",
              render: (r) => rwf(r.revenue),
            },
            {
              key: "cost",
              label: "Cost",
              align: "right",
              render: (r) => rwf(r.cost),
            },
            {
              key: "profit",
              label: "Profit",
              align: "right",
              render: (r) => (
                <span
                  className={
                    r.profit >= 0
                      ? "text-emerald-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {rwf(r.profit)}
                </span>
              ),
            },
          ]}
          rows={rows}
        />
      )}

      {view === "day" && (
        <SimpleTable
          columns={[
            { key: "date", label: "Date" },
            { key: "quantity_sold", label: "Qty", align: "right" },
            {
              key: "revenue",
              label: "Revenue",
              align: "right",
              render: (r) => rwf(r.revenue),
            },
            {
              key: "cost",
              label: "Cost",
              align: "right",
              render: (r) => rwf(r.cost),
            },
            {
              key: "profit",
              label: "Profit",
              align: "right",
              render: (r) => (
                <span
                  className={
                    r.profit >= 0
                      ? "text-emerald-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {rwf(r.profit)}
                </span>
              ),
            },
            {
              key: "profit_margin_pct",
              label: "Margin %",
              align: "right",
              render: (r) => `${r.profit_margin_pct}%`,
            },
          ]}
          rows={rows}
        />
      )}
    </div>
  );
};

/* ============================================================
   VAT TAB
============================================================ */
const VatReport = ({ data }) => {
  const reportData = data?.data || data;

  if (!reportData?.summary || !reportData?.by_category) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading VAT report...
      </div>
    );
  }

  return (
    // ← ADD THIS
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card
          label="Gross (incl. VAT)"
          value={rwf(reportData.summary.total_gross)}
        />
        <Card
          label="VAT Collected"
          value={rwf(reportData.summary.total_vat)}
          color="text-blue-600"
        />
        <Card
          label="Net (excl. VAT)"
          value={rwf(reportData.summary.total_net)}
          color="text-gray-700"
        />
      </div>

      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
        By VAT Category
      </h3>
      <SimpleTable
        columns={[
          { key: "category", label: "Category" },
          {
            key: "rate",
            label: "Rate %",
            align: "right",
            render: (r) => `${r.rate}%`,
          },
          { key: "lines", label: "Lines", align: "right" },
          {
            key: "gross",
            label: "Gross",
            align: "right",
            render: (r) => rwf(r.gross),
          },
          {
            key: "vat",
            label: "VAT",
            align: "right",
            render: (r) => rwf(r.vat),
          },
          {
            key: "net",
            label: "Net",
            align: "right",
            render: (r) => rwf(r.net),
          },
        ]}
        rows={reportData.by_category}
      />

      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
        Daily VAT
      </h3>
      <SimpleTable
        columns={[
          { key: "date", label: "Date" },
          {
            key: "gross",
            label: "Gross",
            align: "right",
            render: (r) => rwf(r.gross),
          },
          {
            key: "vat",
            label: "VAT",
            align: "right",
            render: (r) => rwf(r.vat),
          },
          {
            key: "net",
            label: "Net",
            align: "right",
            render: (r) => rwf(r.net),
          },
        ]}
        rows={reportData.by_day}
      />
    </div>
  ); // ← closes the return
};
/* ============================================================
   SHIFT TAB
============================================================ */
const ShiftReport = ({ data }) => {
  const reportData = data?.data || data;

  if (!reportData?.summary || !reportData?.shifts) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading shifts report...
      </div>
    );
  }

  return (
    // ← ADD THIS
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card label="Shifts" value={reportData.summary.total_shifts} />
        <Card
          label="Revenue"
          value={rwf(reportData.summary.total_revenue)}
          color="text-emerald-600"
        />
        <Card
          label="Balanced"
          value={reportData.summary.balanced_shifts}
          color="text-emerald-600"
        />
        <Card
          label="Short"
          value={reportData.summary.short_shifts}
          color="text-red-600"
        />
        <Card
          label="Over"
          value={reportData.summary.over_shifts}
          color="text-orange-600"
        />
      </div>

      <SimpleTable
        columns={[
          { key: "cashier", label: "Cashier" },
          { key: "business_date", label: "Date" },
          { key: "status", label: "Status", render: (r) => r.status },
          { key: "transaction_count", label: "Txns", align: "right" },
          {
            key: "total_sales",
            label: "Sales",
            align: "right",
            render: (r) => rwf(r.total_sales),
          },
          {
            key: "cash_sales",
            label: "Cash",
            align: "right",
            render: (r) => rwf(r.cash_sales),
          },
          {
            key: "expected_cash",
            label: "Expected",
            align: "right",
            render: (r) => rwf(r.expected_cash),
          },
          {
            key: "actual_cash",
            label: "Actual",
            align: "right",
            render: (r) => rwf(r.actual_cash),
          },
          {
            key: "difference",
            label: "Diff",
            align: "right",

            render: (r) => (
              <span
                className={
                  r.is_balanced
                    ? "text-emerald-600 font-bold"
                    : r.difference < 0
                      ? "text-red-600 font-bold"
                      : "text-orange-600 font-bold"
                }
              >
                {rwf(r.difference)}
              </span>
            ),
          },
        ]}
        rows={reportData.shifts}
      />
    </div>
  ); // ← closes the return
};

/* ============================================================
   MOVEMENTS TAB
============================================================ */
const MovementsReport = ({ data }) => {
  const reportData = data;
  console.log("this is the report data", reportData);

  // Guard: if data isn't shaped like a movements report, don't crash
  if (!reportData?.summary || !reportData?.pagination) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading stock movements report...
      </div>
    );
  }

  return (
    // ← ADD THIS
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card label="Movements" value={reportData.pagination.total} />
        <Card
          label="Total In"
          value={
            reportData.summary.by_type?.find((t) => t.type === "IN")
              ?.total_quantity || 0
          }
          color="text-emerald-600"
        />
        <Card
          label="Total Out"
          value={
            reportData.summary.by_type?.find((t) => t.type === "OUT")
              ?.total_quantity || 0
          }
          color="text-red-600"
        />
      </div>

      <SimpleTable
        columns={[
          {
            key: "created_at",
            label: "Date",
            render: (r) => new Date(r.created_at).toLocaleString(),
          },
          {
            key: "product",
            label: "Product",
            render: (r) => r.product?.name || "—",
          },
          {
            key: "batch_code",
            label: "Batch",
            render: (r) => r.batch?.batch_code || "—",
          },
          {
            key: "type",
            label: "Type",
            render: (r) => (
              <span
                className={
                  r.type === "IN"
                    ? "px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-black"
                    : "px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-black"
                }
              >
                {r.type}
              </span>
            ),
          },
          { key: "quantity", label: "Qty", align: "right" },
          { key: "user", label: "By", render: (r) => r.user?.full_name || "—" },
          { key: "reason", label: "Reason" },
        ]}
        rows={reportData.data}
        emptyText="No stock movements in this range"
      />
    </div>
  ); // ← closes the return
};
/* ============================================================
   PURCHASES TAB
============================================================ */
const PurchasesReport = ({ data }) => {
  const reportData = data?.data || data;

  // Add guard
  if (!reportData?.summary) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading purchases report...
      </div>
    );
  }

  return (
    // ← ADD THIS
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card label="Events" value={reportData.summary.total_events} />
        <Card
          label="Units Received"
          value={reportData.summary.total_units}
          color="text-blue-600"
        />
        <Card
          label="Total Cost"
          value={rwf(reportData.summary.total_cost)}
          color="text-emerald-600"
        />
      </div>

      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
        By Supplier
      </h3>
      <SimpleTable
        columns={[
          { key: "supplier", label: "Supplier" },
          { key: "events", label: "Events", align: "right" },
          { key: "units", label: "Units", align: "right" },
          {
            key: "cost",
            label: "Cost",
            align: "right",
            render: (r) => rwf(r.cost),
          },
        ]}
        rows={reportData.by_supplier || []}
      />

      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
        By Product
      </h3>
      <SimpleTable
        columns={[
          { key: "name", label: "Product" },
          { key: "barcode", label: "Barcode" },
          { key: "events", label: "Events", align: "right" },
          { key: "units", label: "Units", align: "right" },
          {
            key: "cost",
            label: "Cost",
            align: "right",
            render: (r) => rwf(r.cost),
          },
        ]}
        rows={reportData.by_product || []}
      />
    </div>
  ); // ← closes the return
};

export default Reports;
