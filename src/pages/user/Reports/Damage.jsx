import { useState, useRef, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Plus,
  Search,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Package,
  Camera,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  ImageIcon,
  ZoomIn,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getAllProducts } from "../../../utils/product.util";
import {
  createDamageReport,
  getAllDamageReports,
  getMyDamageReports,
} from "../../../utils/damage.util.js";

// ─── constants ────────────────────────────────────────────────────────────────
const DAMAGE_TYPES = [
  "Cover Breakage",
  "Water Leakage",
  "Rotten / Mold",
  "Electrical Failure",
  "Opened / Unsealed",
  "Missing Parts",
  "Physical Damage",
  "Scratches / Dents",
  "Other",
];

const SEVERITY_CONFIG = {
  Minor: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
    ring: "ring-emerald-300",
  },
  Moderate: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    ring: "ring-amber-300",
  },
  Severe: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    ring: "ring-red-300",
  },
};

const STATUS_CONFIG = {
  Pending: { color: "text-blue-700", bg: "bg-blue-50" },
  "In Review": { color: "text-amber-700", bg: "bg-amber-50" },
  Resolved: { color: "text-green-700", bg: "bg-green-50" },
};

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

// ─── auth helper ─────────────────────────────────────────────────────────────
function getCurrentUser() {
  try {
    const authData = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      id: authData?.data?.user?.id ?? "",
      name: authData?.data?.user?.full_name ?? "Unknown",
    };
  } catch {
    return { id: "", name: "Unknown" };
  }
}

// ─── small shared components ──────────────────────────────────────────────────
function SeverityBadge({ label }) {
  const c = SEVERITY_CONFIG[label] || SEVERITY_CONFIG.Minor;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.color} ${c.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const c = STATUS_CONFIG[label] || STATUS_CONFIG.Pending;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.color} ${c.bg}`}
    >
      {label}
    </span>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }) {
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertTriangle size={11} />
      {msg}
    </p>
  );
}

function inputCls(focused) {
  return `w-full px-3 py-2.5 text-sm text-slate-800 bg-white border rounded-lg outline-none transition-all
    ${focused ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300"}`;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setIdx((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[900] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[idx]}
          alt={`Damage photo ${idx + 1}`}
          className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
        />
        {/* close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
        >
          <X size={14} className="text-slate-600" />
        </button>
        {/* prev */}
        {idx > 0 && (
          <button
            onClick={() => setIdx((i) => i - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-2 transition-colors"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
        )}
        {/* next */}
        {idx < images.length - 1 && (
          <button
            onClick={() => setIdx((i) => i + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-2 transition-colors"
          >
            <ArrowRight size={18} className="text-white" />
          </button>
        )}
        {images.length > 1 && (
          <p className="text-center text-white/60 text-sm mt-3">
            {idx + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Image thumbnails (for table rows) ───────────────────────────────────────
function ImageThumbs({ report }) {
  const [lightbox, setLightbox] = useState(null);
  const images = [report.image_1_url, report.image_2_url].filter(Boolean);

  if (!images.length) return <span className="text-slate-300 text-xs">—</span>;

  return (
    <>
      <div className="flex gap-1.5">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-violet-400 hover:scale-105 transition-all group"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn
                size={12}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <Lightbox
          images={images}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

// ─── Item search ──────────────────────────────────────────────────────────────
function ItemSearch({ selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const inputRef = useRef();
  const boxRef = useRef();

  const fetchItems = useCallback(
    debounce(async (q) => {
      if (!q.trim()) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getAllProducts({ search: q, limit: 20 });
        setItems(res?.data ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 350),
    [],
  );

  useEffect(() => {
    const fn = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const pick = (item) => {
    onSelect(item);
    setQuery(item.name);
    setOpen(false);
    setItems([]);
  };
  const clear = () => {
    onSelect(null);
    setQuery("");
    setItems([]);
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, items.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (items[hi]) pick(items[hi]);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative">
      {/* input */}
      <div
        className={`flex items-center gap-2 px-3 border rounded-lg bg-white transition-all
        ${open ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300"}`}
      >
        {loading ? (
          <Loader2
            size={15}
            className="text-violet-500 animate-spin shrink-0"
          />
        ) : (
          <Search
            size={15}
            className={open ? "text-violet-500" : "text-slate-400"}
          />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHi(0);
            fetchItems(e.target.value);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKey}
          placeholder="Type item name or barcode…"
          className="flex-1 py-2.5 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={clear}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && query.trim() && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {items.length === 0 && !loading ? (
            <div className="py-5 px-4 text-center text-sm text-slate-400">
              No products found for "{query}"
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id}
                onMouseDown={() => pick(item)}
                onMouseEnter={() => setHi(i)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                  ${i === hi ? "bg-violet-50" : "hover:bg-slate-50"}
                  ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 flex gap-1.5 mt-0.5">
                    <span>{item.barcode ?? "—"}</span>
                    {item.category?.name && (
                      <>
                        <span>·</span>
                        <span>{item.category.name}</span>
                      </>
                    )}
                  </p>
                </div>
                {item.stock_quantity !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                    ${item.stock_quantity > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                  >
                    {item.stock_quantity > 0
                      ? `Qty ${item.stock_quantity}`
                      : "Out"}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* selected pill */}
      {selected && (
        <div className="mt-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg flex items-center gap-2">
          <CheckCircle size={13} className="text-violet-600 shrink-0" />
          <span className="text-xs font-semibold text-violet-800">
            {selected.name}
            <span className="font-normal text-violet-500 ml-1.5">
              ({selected.barcode ?? selected.id})
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Image upload zone ────────────────────────────────────────────────────────
function ImageZone({ label, note, value, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  const handle = (file) => {
    if (!file?.type.startsWith("image/")) return;
    onChange({ file, url: URL.createObjectURL(file) });
  };

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div
        onClick={() => !value && ref.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files[0]);
        }}
        className={`relative rounded-xl overflow-hidden transition-all min-h-[140px] flex items-center justify-center
          border-2 border-dashed
          ${
            drag
              ? "border-violet-400 bg-violet-50 scale-[1.01]"
              : value
                ? "border-violet-300 cursor-default"
                : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer"
          }`}
      >
        {value ? (
          <>
            <img src={value.url} alt="" className="w-full h-36 object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-black/80 transition-colors flex items-center gap-1"
            >
              <X size={10} /> Remove
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 pt-5">
              <p className="text-[10px] text-white/90 truncate">
                {value.file.name}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center p-5">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-2.5">
              <Upload size={18} className="text-violet-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {drag ? "Drop here" : "Click or drag"}
            </p>
            <p className="text-xs text-slate-400 mt-1">{note}</p>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files[0])}
      />
    </div>
  );
}

// ─── Modal section wrapper ────────────────────────────────────────────────────
function ModalSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <Icon size={13} className="text-violet-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ onClose, onSubmit }) {
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    selectedItem: null,
    damageType: "",
    severity: "",
    location: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    estimatedCost: "",
    witnesses: "",
  });
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const backdropRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.selectedItem) e.item = "Please select an item";
    if (!form.damageType) e.damageType = "Please select a damage type";
    if (!form.severity) e.severity = "Please select severity";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    const generateReference = () => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // ensures 4 digits
      return `REF-${randomDigits}`;
    };

    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await createDamageReport({
        product_id: form.selectedItem.id,
        reported_by_id: currentUser.id,
        ref_number: generateReference(),
        damage_type: form.damageType,
        severity: form.severity,
        description: form.description,
        location: form.location,
        estimated_cost: form.estimatedCost,
        witnesses: form.witnesses,
        incident_date: form.date,
        image_1: img1?.file ?? null,
        image_2: img2?.file ?? null,
      });
      onSubmit(res.data);
    } catch (err) {
      setApiError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl animate-modalIn my-auto">
        {/* ── header ── */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                New Damage Report
              </h2>
              <p className="text-xs text-slate-400">
                Submitting as{" "}
                <span className="font-semibold text-slate-600">
                  {currentUser.name}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── body ── */}
        <div className="px-6 py-5 space-y-4">
          {/* Item */}
          <ModalSection icon={Package} title="Item Information">
            <div>
              <FieldLabel required>Select Item</FieldLabel>
              <ItemSearch
                selected={form.selectedItem}
                onSelect={(v) => set("selectedItem", v)}
              />
              {errors.item && <FieldError msg={errors.item} />}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Incident Date</FieldLabel>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  onFocus={() => setFocused("date")}
                  onBlur={() => setFocused(null)}
                  className={inputCls(focused === "date")}
                />
              </div>
              <div>
                <FieldLabel>Location / Room</FieldLabel>
                <div className="relative">
                  <MapPin
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    placeholder="e.g. Store Room A"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    onFocus={() => setFocused("loc")}
                    onBlur={() => setFocused(null)}
                    className={`${inputCls(focused === "loc")} pl-8`}
                  />
                </div>
              </div>
            </div>
          </ModalSection>

          {/* Damage */}
          <ModalSection icon={AlertTriangle} title="Damage Details">
            <div>
              <FieldLabel required>Damage Type</FieldLabel>
              <select
                value={form.damageType}
                onChange={(e) => set("damageType", e.target.value)}
                onFocus={() => setFocused("dt")}
                onBlur={() => setFocused(null)}
                className={`${inputCls(focused === "dt")} cursor-pointer`}
              >
                <option value="">Select type…</option>
                {DAMAGE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {errors.damageType && <FieldError msg={errors.damageType} />}
            </div>

            <div>
              <FieldLabel required>Severity</FieldLabel>
              <div className="flex gap-2">
                {Object.entries(SEVERITY_CONFIG).map(([label, c]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set("severity", label)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all
                      ${
                        form.severity === label
                          ? `${c.border} ${c.bg} ${c.color} ring-2 ${c.ring} scale-[1.02]`
                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                      }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${c.dot} mx-auto mb-1`}
                    />
                    {label}
                  </button>
                ))}
              </div>
              {errors.severity && <FieldError msg={errors.severity} />}
            </div>

            <div>
              <FieldLabel required>Description</FieldLabel>
              <textarea
                placeholder="Describe how the damage occurred and the current condition…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onFocus={() => setFocused("desc")}
                onBlur={() => setFocused(null)}
                rows={3}
                className={`${inputCls(focused === "desc")} resize-none leading-relaxed`}
              />
              {errors.description && <FieldError msg={errors.description} />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Estimated Cost (RWF)</FieldLabel>
                <div className="relative">
                  <DollarSign
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={form.estimatedCost}
                    onChange={(e) => set("estimatedCost", e.target.value)}
                    onFocus={() => setFocused("cost")}
                    onBlur={() => setFocused(null)}
                    className={`${inputCls(focused === "cost")} pl-8`}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Witnesses</FieldLabel>
                <div className="relative">
                  <Users
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    placeholder="Names of witnesses"
                    value={form.witnesses}
                    onChange={(e) => set("witnesses", e.target.value)}
                    onFocus={() => setFocused("wit")}
                    onBlur={() => setFocused(null)}
                    className={`${inputCls(focused === "wit")} pl-8`}
                  />
                </div>
              </div>
            </div>
          </ModalSection>

          {/* Photos */}
          <ModalSection icon={Camera} title="Damage Photos">
            <p className="text-xs text-slate-400 -mt-1">
              Upload at least one clear photo. Two are recommended.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ImageZone
                label="Photo 1 — Primary"
                note="Front / main area"
                value={img1}
                onChange={setImg1}
              />
              <ImageZone
                label="Photo 2 — Secondary"
                note="Side / close-up"
                value={img2}
                onChange={setImg2}
              />
            </div>
          </ModalSection>

          {/* API error */}
          {apiError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle
                size={15}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}
        </div>

        {/* ── footer ── */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600
              hover:from-violet-700 hover:to-purple-700 rounded-xl shadow-md shadow-violet-200
              disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Uploading &amp;
                Submitting…
              </>
            ) : (
              <>
                <Plus size={14} /> Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-slate-50">
      {Array.from({ length: 8 }).map((_, j) => (
        <td key={j} className="px-4 py-3">
          <div
            className="h-4 bg-slate-100 rounded animate-pulse"
            style={{ width: `${60 + Math.random() * 30}%` }}
          />
        </td>
      ))}
    </tr>
  ));
}

function CardSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-white"
    >
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="flex justify-between pt-1">
        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  ));
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const Damage = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSev, setFilterSev] = useState("All");
  const [page, setPage] = useState(1);
  const [lb, setLb] = useState(null);

  const fireToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReports = useCallback(async (q, sev, pg) => {
    setLoading(true);
    const filters = { page: pg, limit: 20 };
    if (q) filters.search = q;
    if (sev !== "All") filters.severity = sev;
    try {
      const res = await getMyDamageReports(filters);
      setReports(res?.data ?? []);
      setPagination(res?.pagination ?? null);
    } catch {
      fireToast("Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(search, filterSev, page);
  }, [search, filterSev, page]);

  const debouncedSearch = useCallback(
    debounce((v) => {
      setPage(1);
      setSearch(v);
    }, 400),
    [],
  );

  // Utility to generate REF-[4 random digits]

  const handleSubmit = (newReport) => {
    setReports((r) => [newReport, ...r]);
    if (pagination) setPagination((p) => ({ ...p, total: p.total + 1 }));
    setShowModal(false);
    fireToast("Damage report submitted successfully");
  };

  // severity counts from current page data (ideally backend provides totals)
  const counts = Object.keys(SEVERITY_CONFIG).reduce((acc, s) => {
    acc[s] = reports.filter((r) => r.severity === s).length;
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(.97) translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .animate-modalIn { animation: modalIn .2s ease; }
        .animate-fadeIn  { animation: fadeIn  .15s ease; }
        .animate-toastIn { animation: toastIn .3s ease; }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen mx-auto space-y-5">
          {/* ── header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Damage Reports
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {loading
                  ? "Loading…"
                  : `${pagination?.total ?? reports.length} report${(pagination?.total ?? reports.length) !== 1 ? "s" : ""} on file`}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600
                hover:from-violet-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl
                shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all hover:scale-[1.02]"
            >
              <Plus size={16} />
              New Report
            </button>
          </div>

          {/* ── summary cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(SEVERITY_CONFIG).map(([label, c]) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
              >
                <div className={`text-2xl font-black ${c.color}`}>
                  {counts[label] ?? 0}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{" "}
                  {label}
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm col-span-2 sm:col-span-1 hidden sm:block">
              <div className="text-2xl font-black text-violet-600">
                {pagination?.total ?? reports.length}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                Total Reports
              </div>
            </div>
          </div>

          {/* ── filters ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                placeholder="Search by item, barcode, or reporter…"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none
                  focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Minor", "Moderate", "Severe"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setFilterSev(s);
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all
                    ${
                      filterSev === s
                        ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── table / grid ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* ── desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[
                      "Ref ID",
                      "Item",
                      "Damage Type",
                      "Description",
                      "Severity",

                      "Date",
                      "Status",
                      "Photos",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <TableSkeleton />
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="text-3xl mb-3">🗂️</div>
                        <p className="text-sm font-semibold text-slate-500">
                          No reports found
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Try adjusting your filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-md">
                            {String(r.id).slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800 text-sm truncate max-w-[160px]">
                            {r.product?.name ?? "—"}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {r.product?.barcode ?? ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {r.damage_type}
                        </td>
                        <td className="px-4 py-3">
                          <label className="text-slate-600 text-xs">
                            {r.description}
                          </label>
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge label={r.severity} />
                        </td>

                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {r.incident_date}
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge label={r.status} />
                        </td>
                        <td className="px-4 py-3">
                          <ImageThumbs report={r} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── mobile card grid ── */}
            <div className="md:hidden p-3 space-y-3">
              {loading ? (
                <CardSkeleton />
              ) : reports.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-3xl mb-3">🗂️</div>
                  <p className="text-sm font-semibold text-slate-500">
                    No reports found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                reports.map((r) => {
                  const images = [r.image_1_url, r.image_2_url].filter(Boolean);

                  return (
                    <div
                      key={r.id}
                      className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {r.product?.name ?? "—"}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {r.product?.barcode}
                          </p>
                        </div>
                        <StatusBadge label={r.status} />
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <SeverityBadge label={r.severity} />
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                          {r.damage_type}
                        </span>
                      </div>

                      {images.length > 0 && (
                        <div className="flex gap-2">
                          {images.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => setLb(i)}
                              className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 hover:border-violet-400 transition-colors"
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                          {lb !== null && (
                            <Lightbox
                              images={images}
                              startIndex={lb}
                              onClose={() => setLb(null)}
                            />
                          )}
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {r.incident_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={10} />
                          {r.description}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── pagination ── */}
          {!loading && pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200
                  bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-sm text-slate-500 font-medium">
                Page <span className="font-bold text-slate-800">{page}</span> of{" "}
                {pagination.pages}
              </span>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200
                  bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ReportModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* ── toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5
          px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl z-[999] animate-toastIn whitespace-nowrap
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}
        >
          <span
            className={
              toast.type === "error" ? "text-red-200" : "text-violet-400"
            }
          >
            {toast.type === "error" ? "✕" : "✓"}
          </span>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default Damage;
