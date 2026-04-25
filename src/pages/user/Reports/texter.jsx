import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  Search,
  TrendingUp,
  Filter,
  Tag,
  User,
  Paperclip,
  Calendar,
} from "lucide-react";

const ExpenseTracker = () => {
  /* ===================== STATE & DATA ===================== */
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([
    "Travel",
    "Meals",
    "Supplies",
    "Utilities",
    "Other",
  ]);
  const [newCatName, setNewCatName] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    receipt: null,
    paymentMethod: "cash",
    approvedBy: "System Admin (Pending)",
    notes: "",
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Replace with: const res = await fetch('YOUR_API_URL');
      const mockData = JSON.parse(
        localStorage.getItem("cashier_expenses") || "[]",
      );
      setExpenses(mockData);
    } catch (e) {
      console.error("Fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ===================== LOGIC ===================== */
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return expense.date?.includes(today) && matchesSearch;
    } else if (filter === "pending")
      return expense.status === "pending" && matchesSearch;
    else if (filter === "approved")
      return expense.status === "approved" && matchesSearch;
    return matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0,
  );
  const approvedTotal = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const handleAddCategory = () => {
    if (newCatName && !categories.includes(newCatName)) {
      setCategories([...categories, newCatName]);
      setFormData({ ...formData, category: newCatName });
      setIsAddingCategory(false);
      setNewCatName("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: editingId || Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      status: "pending",
      date: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [
      newExpense,
      ...expenses.filter((ex) => ex.id !== editingId),
    ];
    setExpenses(updated);
    localStorage.setItem("cashier_expenses", JSON.stringify(updated));
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      description: "",
      receipt: null,
      paymentMethod: "cash",
      approvedBy: "System Admin (Pending)",
      notes: "",
    });
    setEditingId(null);
    setIsAddingCategory(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 sm:p-6 text-xs selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
              EXPENSE TERMINAL
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              Live Audit Ledger
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-all text-[11px] shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> NEW RECORD
          </button>
        </header>

        {/* Dense Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            title="Total Volume"
            value={totalAmount}
            color="blue"
            unit="RWF"
          />
          <StatCard
            title="Approved Cash"
            value={approvedTotal}
            color="emerald"
            unit="RWF"
          />
          <StatCard
            title="Pending"
            value={expenses.filter((e) => e.status === "pending").length}
            color="amber"
            unit="Items"
            isText
          />
          <StatCard
            title="Current Filter"
            value={filter}
            color="purple"
            unit="Mode"
            isText
          />
        </section>

        {/* Compact Filter Bar */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter by purpose or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg outline-none focus:border-blue-500/50 transition-all text-xs"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            {["all", "today", "pending", "approved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${filter === f ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Expense Rows - Dense Layout */}
        <div className="space-y-1.5">
          {loading ? (
            <div className="p-10 text-center opacity-50 italic">
              Loading Ledger...
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="group bg-slate-900/30 hover:bg-slate-800/40 border border-slate-800/40 rounded-xl p-3 flex items-center gap-4 transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-slate-950 flex items-center justify-center text-blue-500/50 group-hover:text-blue-400 border border-white/5">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-slate-200 truncate uppercase tracking-tighter">
                      {expense.description}
                    </p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 font-black uppercase">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tight">
                    {expense.date} • {expense.paymentMethod}
                  </p>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="font-black text-white text-sm">
                      {Number(expense.amount).toLocaleString()}{" "}
                      <span className="text-[9px] text-slate-600">RWF</span>
                    </p>
                    <StatusPill status={expense.status} />
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-blue-400 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FORM MODAL - Compact Scale */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md z-10 flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                New Expenditure
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Amount (RWF)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-[10px]">
                    RWF
                  </div>
                  <input
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:border-blue-500 outline-none text-lg font-black text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Category
                  </label>
                  <div className="flex gap-1.5">
                    {isAddingCategory ? (
                      <input
                        autoFocus
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onBlur={handleAddCategory}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCategory()
                        }
                        className="flex-1 px-3 bg-slate-950 border border-blue-500/50 rounded-lg outline-none text-[11px] font-bold"
                        placeholder="New..."
                      />
                    ) : (
                      <>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2.5 bg-slate-950 border border-white/5 rounded-lg focus:border-blue-500 outline-none text-[11px] font-bold appearance-none"
                        >
                          <option value="">Select</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Payment
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-[11px] font-bold"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="momo">📱 MoMo</option>
                    <option value="card">💳 Card</option>
                    <option value="item-exchange">🔄 Exchange</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:border-blue-500 outline-none text-[11px]"
                  placeholder="Required..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Receipt
                  </label>
                  <label className="flex items-center justify-center w-full h-[42px] px-3 bg-slate-950 border border-dashed border-white/10 rounded-lg cursor-pointer hover:border-blue-500/50 group transition-all">
                    <Paperclip className="w-3 h-3 mr-2 text-slate-500 group-hover:text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">
                      Attach
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setFormData({ ...formData, receipt: e.target.files[0] })
                      }
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 opacity-50 italic">
                    Approver
                  </label>
                  <div className="flex items-center px-3 h-[42px] bg-white/5 border border-white/5 rounded-lg text-slate-600 text-[10px] font-bold gap-2 opacity-50 cursor-not-allowed">
                    <User className="w-3 h-3" /> System
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Internal Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:border-blue-500 outline-none text-[11px]"
                  placeholder="Audit context..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-900/40 transition-all text-[11px] tracking-widest uppercase"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3.5 bg-slate-800 text-white rounded-xl font-black text-[11px] uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Sub-Components (Compact) --- */
const StatCard = ({ title, value, color, unit, isText }) => {
  const styles = {
    blue: "text-blue-400 border-blue-500/10 bg-blue-500/5",
    emerald: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
    amber: "text-amber-400 border-amber-500/10 bg-amber-500/5",
    purple: "text-purple-400 border-purple-500/10 bg-purple-500/5",
  };
  return (
    <div className={`p-4 rounded-xl border ${styles[color]} backdrop-blur-sm`}>
      <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50 mb-1">
        {title}
      </p>
      <p className="text-sm font-black text-white truncate leading-none">
        {isText ? value : value.toLocaleString()}{" "}
        <span className="text-[8px] opacity-40 font-bold ml-1">{unit}</span>
      </p>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    pending: "text-amber-500 bg-amber-500/5 border-amber-500/20",
    approved: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
  };
  return (
    <span
      className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default ExpenseTracker;
