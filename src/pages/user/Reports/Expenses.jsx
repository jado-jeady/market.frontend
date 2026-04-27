import { useEffect, useState } from "react";
import {
  createNewExpense,
  updateExistingExpense,
  abortExpense,
} from "../../../utils/expenses.util.js";
import { getCurrentShift } from "../../../utils/shift.util.js";
import {
  Plus,
  Edit2,
  Ban,
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
} from "lucide-react";

const ExpenseTracker = () => {
  /* ===================== STATE ===================== */
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
    status: "Pending",
    notes: "",
  });

  /* ===================== Get user Id ===================== */
  const getUserId = () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    return authData?.data?.user?.id;
  };

  /* ===================== API HANDLERS ===================== */
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Mocked API call - replace with your actual backend URL
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      // Fallback for local testing
      const localData = JSON.parse(
        localStorage.getItem("cashier_expenses") || "[]",
      );
      setExpenses(localData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName || categories.includes(newCatName)) return;

    if (window.confirm(`Add "${newCatName}" to database categories?`)) {
      try {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCatName }),
        });
        setCategories([...categories, newCatName]);
        setFormData({ ...formData, category: newCatName });
        setIsAddingCategory(false);
        setNewCatName("");
      } catch (e) {
        console.error("Failed to save category", e);
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ===================== CORE LOGIC ===================== */
  const canEdit = (createdAt) => {
    if (!createdAt) return false;
    const createdTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return now - createdTime < 24 * 60 * 60 * 1000; // 24 Hours in ms
  };

  const handleAbort = async (id) => {
    if (window.confirm("Abort this expense?")) {
      const result = await abortExpense(id);
      if (result.success) {
        // Update local state by mapping through and changing the status
        setExpenses((prev) =>
          prev.map((ex) => (ex.id === id ? { ...ex, status: "aborted" } : ex)),
        );
      }
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    return e.status === filter && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      const shift = await getCurrentShift();
      const currentShiftId = shift?.data?.id;
      const currentUserId = await getUserId();
      console.log(
        "Submitting form with data:",
        formData,
        "Shift ID:",
        currentShiftId,
        "User ID:",
        currentUserId,
      );
      if (editingId) {
        // Logic for Update
        result = await updateExistingExpense(editingId, formData);
      } else {
        // Logic for Create
        // Add shiftId and userId if they aren't in formData already
        const payload = {
          ...formData,
          shiftId: currentShiftId,
          userId: currentUserId,
        };
        console.log("Final payload for creation:", payload);
        result = await createNewExpense(payload);
      }

      if (result.success) {
        // Refresh list from backend to ensure data integrity
        const freshData = await fetchAllExpenses();
        setExpenses(freshData.data);

        setShowForm(false);
        resetForm();
      } else {
        alert(result.message || "Operation failed");
        console.error("API error response:", result); // Log the full API response for debugging
      }
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      description: "",
      receipt: null,
      paymentMethod: "cash",
      status: "Pending",
      notes: "",
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 text-[12px]">
      <div className="max-full mx-auto bg-white p-3 rounded-xl overflow-hidden">
        {/* Header - Minimal Light */}
        <header className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Expenses Records
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Internal Expense Ledger
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-bold transition-all text-[11px]"
          >
            <Plus className="w-3.5 h-3.5" /> NEW ENTRY
          </button>
        </header>

        {/* Dense Stats - Grayscale */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border-b border-gray-200">
          <StatCard
            title="Total Volume"
            value={filteredExpenses.reduce((s, e) => s + Number(e.amount), 0)}
            unit="RWF"
          />
          <StatCard
            title="Approved"
            value={expenses.filter((e) => e.status === "approved").length}
            unit="Items"
            isText
          />
          <StatCard
            title="Pending"
            value={expenses.filter((e) => e.status === "pending").length}
            unit="Items"
            isText
          />
          <StatCard
            title="Aborted"
            value={expenses.filter((e) => e.status === "aborted").length}
            unit="Items"
            isText
          />
        </section>

        {/* Filter Bar */}
        <div className="p-4 flex flex-col md:flex-row gap-2 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-xs focus:border-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["all", "pending", "approved", "aborted"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Dense List */}
        <div className="divide-y divide-gray-100">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="group hover:bg-gray-50 p-3 flex items-center gap-4 transition-all"
            >
              <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 truncate uppercase">
                    {expense.description}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold uppercase">
                    {expense.category}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">
                  {new Date(expense.createdAt).toLocaleString()} •{" "}
                  {expense.paymentMethod}
                </p>
              </div>
              <div className="text-right flex items-center gap-4">
                <p className="font-black text-gray-900 text-sm">
                  {Number(expense.amount).toLocaleString()}{" "}
                  <span className="text-[9px] text-gray-400">RWF</span>
                </p>
                <div className="flex gap-1">
                  {canEdit(expense.createdAt) && (
                    <button
                      onClick={() => {
                        setFormData(expense);
                        setEditingId(expense.id);
                        setShowForm(true);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAbort(expense.id)}
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*      {showForm && <ExpenseForm />} */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 bg-gray-100 z-10 flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                New Expenditure
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Required Amount (RWF)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-bold">
                    RWF
                  </span>
                  <input
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 outline-none text-sm text-gray-800"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category with Dynamic Add */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <div className="flex gap-2">
                    {isAddingCategory ? (
                      <div className="flex w-full gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 px-2 py-2 bg-gray-50 border border-blue-400 rounded-md outline-none text-xs text-gray-800"
                          placeholder="Cat Name..."
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-3 py-2 bg-blue-600 rounded-md text-white text-xs"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
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
                          className="flex-1 px-2 py-2 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 outline-none text-xs text-gray-800"
                        >
                          <option value="">Select Type</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="px-3 py-2 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-md text-xs text-gray-700 transition-colors"
                          title="Add New Category"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 outline-none text-xs text-gray-800"
                  >
                    <option value="cash">Cash</option>
                    <option value="momo">Mobile Money</option>
                    <option value="card">Bank Card</option>
                    <option value="item-exchange">Item Exchange</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Purpose/Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 outline-none text-xs text-gray-800"
                  placeholder="What is this for?"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Attachment/Receipt
                </label>
                <label className="flex flex-col items-center justify-center w-full px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors group">
                  <Paperclip className="w-4 h-4 mb-1 text-gray-500 group-hover:text-blue-500" />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Upload Receipt (PDF or Image, ≤10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      // Validate size
                      if (file.size > 10 * 1024 * 1024) {
                        alert("File too large! Max 10MB allowed.");
                        return;
                      }

                      // Validate type
                      const allowedTypes = [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        alert(
                          "Invalid file type! Only PDF and images are allowed.",
                        );
                        return;
                      }

                      // Save file in state
                      setFormData({ ...formData, receipt: file });

                      // Preview
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({
                          ...formData,
                          receipt: file,
                          receiptPreview: reader.result,
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>

                {/* File Info + Preview */}
                {formData.receipt && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-gray-600">
                      Selected:{" "}
                      <span className="font-semibold">
                        {formData.receipt.name}
                      </span>{" "}
                      ({(formData.receipt.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    {formData.receipt.type.startsWith("image/") && (
                      <img
                        src={formData.receiptPreview}
                        alt="Receipt Preview"
                        className="w-32 h-32 object-cover rounded-md border border-gray-200"
                      />
                    )}
                    {formData.receipt.type === "application/pdf" && (
                      <p className="text-xs text-blue-600">
                        PDF file selected (no preview)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Internal Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 outline-none text-xs text-gray-800"
                  placeholder="Optional notes..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold"
                >
                  Record Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-xs font-bold"
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

/* --- Stat Sub-Component --- */
const StatCard = ({ title, value, unit, isText }) => (
  <div className="p-5 bg-white">
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
      {title}
    </p>
    <p className="text-sm font-black text-gray-900">
      {isText ? value : value.toLocaleString()}{" "}
      <span className="text-[8px] text-gray-400 ml-1">{unit}</span>
    </p>
  </div>
);

const StatusPill = ({ status }) => {
  const styles = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    approved: "text-emerald-600 bg-emerald-50 border-emerald-100",
    aborted: "text-red-600 bg-red-50 border-red-100",
  };
  return (
    <span
      className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default ExpenseTracker;
