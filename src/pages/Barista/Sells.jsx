import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import BaristaSidebar from "../../components/BaristaSidebar";
import { getBaristaCategoriesWithProducts } from "../../utils/category.util";
import { getRandomOpenShift } from "../../utils/shift.util";
import ConfirmModal from "../../components/reusables/ConfirmModal";

import {
  Loader2,
  Coffee,
  Plus,
  Minus,
  Printer,
  X,
  Search,
  ReceiptText,
  ShoppingCart,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { createSale, printInvoice } from "../../utils/sales.util";

export default function Sell() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [fetchingMenu, setFetchingMenu] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [search, setSearch] = useState("");
  const [randomOpenShiftId, setRandomOpenShiftId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Mobile panel state: "menu" | "products" | "cart"
  const [mobileView, setMobileView] = useState("products");
  // Whether the category sidebar is shown on tablet
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setFetchingMenu(true);
        const res = await getBaristaCategoriesWithProducts();
        if (res?.success && Array.isArray(res.data)) {
          setCategoriesData(res.data);
          if (res.data.length > 0) setSelectedCategoryName(res.data[0].name);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load barista menus");
      } finally {
        setFetchingMenu(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const shift = await getRandomOpenShift();
        if (shift.data && shift.data.id) {
          setRandomOpenShiftId(shift.data.id);
          console.log("Using open shift ID for sales:", shift.data.id);
        }
      } catch (err) {
        console.error("Error fetching open shift:", err);
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    const cat = categoriesData.find((c) => c.name === selectedCategoryName);
    if (!cat || !Array.isArray(cat.products)) return [];
    return cat.products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categoriesData, selectedCategoryName, search]);

  const addToCart = useCallback(
    (product) => {
      const price = Number(product.selling_price || 0);
      setCart((prev) => {
        const exists = prev.find((i) => i.id === product.id);
        if (exists)
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: selectedCategoryName,
            price,
            barcode: product.barcode,
            quantity: 1,
          },
        ];
      });
    },
    [selectedCategoryName],
  );

  const increaseQty = (id) =>
    setCart((p) =>
      p.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  const decreaseQty = (id) =>
    setCart((p) =>
      p
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      toast.warning("Add items first");
      return;
    }
    // validate the open shift before submiting
    if (!randomOpenShiftId) {
      toast.error(
        "Told you! You need to open a shift before you can place an order",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
      return;
    }
    try {
      setLoading(true);
      console.log("Placing order with cart:", cart);
      const payload = {
        customer_id: null,
        customer_name: tableNumber || "Walk-in",
        payment_method: paymentMethod,
        unit_price: total,
        items: cart.map((i) => ({
          product_id: i.id,
          name: i.name,
          barcode: i.barcode,
          category: i.category,
          price: i.price,
          quantity: i.quantity,
        })),
        shift_id: randomOpenShiftId,
        total,
        saleType: "baristaSales",
      };
      console.log("Order payload:", payload);

      const saleResponse = await createSale(payload);
      console.log("Sale response:", saleResponse);

      if (!saleResponse?.success) {
        throw new Error(saleResponse?.message || "Failed to record sale");
      }

      const receipt = await printInvoice(
        saleResponse,
        import.meta.env.VITE_CLIENT_PRINTER_SERVER_IP_ADDRESS,
      );

      console.log("Receipt:", receipt);

      toast.success("Order placed & receipt printed!");
      clearCart();
      // After placing order on mobile, go back to products view
      setMobileView("products");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ─── Cart panel (shared between desktop right aside and mobile cart view) ───
  const CartPanel = ({ isMobile = false }) => (
    <div
      className={[
        "flex flex-col bg-[#120b06]",
        isMobile
          ? "h-full w-full"
          : "w-[228px] shrink-0 h-160 overflow-y-auto border-l border-[#2c1a10]",
      ].join(" ")}
    >
      {/* Cart header */}
      <div className="shrink-0 flex items-center justify-between px-2 py-3 border-b border-[#2c1a10]">
        {isMobile && (
          <button
            onClick={() => setMobileView("products")}
            className="p-1 rounded-lg text-[#6b5444] hover:text-[#c8924a] transition-colors mr-1"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-[13px] font-black text-[#f5ede2] tracking-tight">
            Order
          </h2>
          <p className="text-[8px] text-[#6b5444] mt-0.5">
            {totalItems === 0
              ? "Empty"
              : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="p-1 rounded-lg text-[#6b5444] hover:text-red-400 transition-colors"
            title="Clear order"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Items list */}
      <div className="flex-1 h-full overflow-y-auto  px-3 py-2 flex flex-col gap-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-8">
            <Coffee size={30} className="text-[#3a2418] animate-pulse" />
            <p className="text-[9px] text-[#6b5444] text-center leading-relaxed">
              Tap a product
              <br />
              to add it here
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#1e1008] border border-[#3a2418] rounded-xl p-2.5 animate-[slideIn_0.15s_ease]"
              style={{ ["--tw-animate-duration"]: "0.15s" }}
            >
              <div className="flex items-start justify-between gap-1.5 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#f5ede2] truncate leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[8px] text-[#6b5444] mt-0.5">
                    {item.category}
                  </p>
                </div>
                <span className="text-[10px] font-black text-[#c8924a] whitespace-nowrap shrink-0">
                  {(item.price * item.quantity).toLocaleString()}
                  <span className="text-[7px] font-normal text-[#6b5444] ml-0.5">
                    Frw
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-[#6b5444]">
                  {item.price.toLocaleString()} × {item.quantity}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-[22px] h-[22px] rounded-full bg-[#3a2418] border border-[#4a3020] flex items-center justify-center text-[#e8d5be] hover:bg-[#c8924a] hover:text-[#1a100a] transition-colors"
                  >
                    <Minus size={9} />
                  </button>
                  <span className="text-[12px] font-black text-[#f5ede2] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-[22px] h-[22px] rounded-full bg-[#3a2418] border border-[#4a3020] flex items-center justify-center text-[#e8d5be] hover:bg-[#c8924a] hover:text-[#1a100a] transition-colors"
                  >
                    <Plus size={9} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pinned footer */}
      <div
        className={
          "shrink-0 border-t fixed bottom-0 left-0 md:relative right-0 border-[#2c1a10] bg-[#120b06] px-3 pt-3 pb-4 flex flex-col gap-2.5"
        }
      >
        <div className="flex items-baseline justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#6b5444]">
            Total
          </span>
          <span className="text-[18px] font-black text-[#f5ede2] leading-none">
            {total.toLocaleString()}
            <span className="text-[9px] font-normal text-[#6b5444] ml-1">
              Frw
            </span>
          </span>
        </div>

        <div className="h-px bg-[#2c1a10]" />

        <input
          type="text"
          placeholder="Table / customer name"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#231510] border border-[#3a2418] text-[#f5ede2] text-[10px] placeholder-[#6b5444] outline-none focus:border-[#c8924a] transition-colors"
        />

        {/* Payment Method */}
        <div className="p-2 border-t border-gray-200">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`py-1 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                paymentMethod === "cash"
                  ? "border-gray-500 lg:bg-red-400 hover:bg-red-500 bg-red-300 text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod("momo")}
              className={`py-2 px-3 text-xs lg:text-gray-700 text-gray-700 rounded-lg border-2 transition ${
                paymentMethod === "momo"
                  ? "border-gray-500 bg-yellow-500 text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              Momo
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`py-2 px-3 text-xs text-white-300 text-gray-700 rounded-lg border-2 transition ${
                paymentMethod === "card"
                  ? "border-gray-500 text-white lg:bg-red-600 bg-red-300 text-gray-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              Card
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowConfirm(true);
            if (!randomOpenShiftId) {
              toast.error(
                "No open shift found. please contact Support Team on +250782228575",
                {
                  position: "top-center",
                  theme: "dark",
                  autoClose: 9000,
                  toastId: "no-open-shift",
                  size: "sm",
                  icon: true,
                  closeButton: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                },
              );
            }
          }}
          disabled={loading || cart.length === 0}
          className={[
            "w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-black tracking-wide transition-all duration-150",
            cart.length === 0 || loading
              ? "bg-[#3a2418] text-[#6b5444] cursor-not-allowed opacity-60"
              : "bg-[#c8924a] text-[#1a100a] hover:bg-[#e0a855] active:scale-[0.97] shadow-lg shadow-[#c8924a]/25",
          ].join(" ")}
        >
          <ReceiptText size={14} />
          Place Order & Print
        </button>

        <p className="text-center text-[8px] text-[#4a3020] leading-relaxed">
          Prints receipt · Records sale · Flags as barista order
        </p>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Order Placement?"
        message="Double check the items below before processing."
        cart={cart}
        total={total}
        isLoading={loading}
        onCancel={() => setShowConfirm(false)}
        onConfirm={async () => {
          await handlePlaceOrder();
          setShowConfirm(false);
        }}
      />
    </div>
  );

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP LAYOUT  (md and above)
          Three-column: categories | products | cart
      ════════════════════════════════════════════ */}
      <div className="hidden md:flex max-h-[1000px] min-h-[95vh]   h-full flex w-full overflow-y-hidden bg-[#150e08] text-[#f5ede2] text-xs">
        {/* LEFT — CATEGORIES */}
        <aside className="w-[148px] shrink-0 flex flex-col border-r border-[#2c1a10] pt-5 pb-3">
          <p className="px-4 mb-3 text-[8px] font-bold tracking-[0.16em] uppercase text-[#6b5444]">
            Menu
          </p>
          <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-1">
            {fetchingMenu ? (
              <div className="flex justify-center pt-6">
                <Loader2 size={14} className="animate-spin text-[#6b5444]" />
              </div>
            ) : categoriesData.length === 0 ? (
              <p className="px-2 text-[10px] italic text-[#6b5444]">No menus</p>
            ) : (
              categoriesData.map((cat) => {
                const active = selectedCategoryName === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryName(cat.name)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-150",
                      active
                        ? "bg-[#c8924a] text-[#1a100a] shadow-md shadow-[#c8924a]/20"
                        : "text-[#e8d5be] hover:bg-[#2c1a10]",
                    ].join(" ")}
                  >
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER — PRODUCTS */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="shrink-0 flex items-center justify-between gap-4 border-b border-[#2c1a10] bg-[#150e08] pl-14 pr-5 py-3">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#f5ede2]">
                {selectedCategoryName || "Barista Menu"}
              </h2>
              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#6b5444]">
                Tap to add to order
              </p>
            </div>
            <div className="relative">
              <Search
                size={11}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b5444] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 pl-8 pr-3 py-2 rounded-xl bg-[#231510] border border-[#3a2418] text-[#f5ede2] text-[11px] placeholder-[#6b5444] outline-none focus:border-[#c8924a] transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 content-start">
            {fetchingMenu ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={28} className="animate-spin text-[#c8924a]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b5444]">
                  Loading…
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#6b5444] text-[11px] font-medium">
                Nothing here
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-[#2c1a10] border border-[#3a2418] rounded-2xl p-3 text-left flex flex-col justify-between min-h-[90px] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#c8924a] hover:shadow-lg hover:shadow-[#c8924a]/10 active:scale-[0.97]"
                >
                  <div>
                    <Coffee size={13} className="text-[#c8924a] mb-1.5" />
                    <h3 className="text-[11px] font-bold text-[#f5ede2] leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-black text-[#c8924a]">
                      {Number(product.selling_price || 0).toLocaleString()}
                      <span className="text-[8px] font-normal text-[#6b5444] ml-0.5">
                        Frw
                      </span>
                    </span>
                    <span className="bg-[#c8924a] text-[#1a100a] text-[9px] font-bold px-2 py-0.5 rounded-full group-hover:bg-[#e0a855] transition-colors">
                      +
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </main>

        {/* RIGHT — CART */}
        <CartPanel isMobile={false} />
      </div>

      {/* ════════════════════════════════════════════
          MOBILE LAYOUT  (below md)
          Single view at a time: products | cart
          Bottom nav to switch between views
      ════════════════════════════════════════════ */}
      <div className="flex md:hidden h-screen w-screen max-w-screen overflow-hidden flex-col overflow-y-scroll  text-[#f5ede2] text-xs">
        {/* ── PRODUCTS VIEW ── */}
        {mobileView === "products" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Topbar */}
            <div className="shrink-0 flex items-center gap-2 border-b border-[#2c1a10] bg-[#150e08] px-3 py-3">
              {/* Category toggle button */}
              <button
                onClick={() => setShowMobileCategories((v) => !v)}
                className="p-2 rounded-xl bg-[#2c1a10] border border-[#3a2418] text-[#c8924a] shrink-0"
              >
                <Menu size={14} />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="text-[13px] font-black tracking-tight text-[#f5ede2] truncate">
                  {selectedCategoryName || "Barista Menu"}
                </h2>
              </div>
              <div className="relative shrink-0">
                <Search
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b5444] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-36 pl-8 pr-3 py-2 rounded-xl bg-[#231510] border border-[#3a2418] text-[#f5ede2] text-[11px] placeholder-[#6b5444] outline-none focus:border-[#c8924a] transition-colors"
                />
              </div>
            </div>

            {/* Slide-down category strip */}
            {showMobileCategories && (
              <div className="shrink-0 border-b border-[#2c1a10] bg-[#120b06] px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {fetchingMenu ? (
                  <Loader2
                    size={12}
                    className="animate-spin text-[#6b5444] my-1"
                  />
                ) : (
                  categoriesData.map((cat) => {
                    const active = selectedCategoryName === cat.name;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryName(cat.name);
                          setShowMobileCategories(false);
                        }}
                        className={[
                          "shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-150 whitespace-nowrap",
                          active
                            ? "bg-[#c8924a] text-[#1a100a] shadow-md shadow-[#c8924a]/20"
                            : "text-[#e8d5be] bg-[#2c1a10] hover:bg-[#3a2418]",
                        ].join(" ")}
                      >
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3 content-start">
              {fetchingMenu ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={28} className="animate-spin text-[#c8924a]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b5444]">
                    Loading…
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-[#6b5444] text-[11px] font-medium">
                  Nothing here
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="group bg-[#2c1a10] border border-[#3a2418] rounded-2xl p-3 text-left flex flex-col justify-between min-h-[90px] transition-all duration-150 active:scale-[0.97] hover:border-[#c8924a]"
                  >
                    <div>
                      <Coffee size={13} className="text-[#c8924a] mb-1.5" />
                      <h3 className="text-[11px] font-bold text-[#f5ede2] leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-black text-[#c8924a]">
                        {Number(product.selling_price || 0).toLocaleString()}
                        <span className="text-[8px] font-normal text-[#6b5444] ml-0.5">
                          Frw
                        </span>
                      </span>
                      <span className="bg-[#c8924a] text-[#1a100a] text-[9px] font-bold px-2 py-0.5 rounded-full group-hover:bg-[#e0a855] transition-colors">
                        +
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Bottom cart FAB — only visible when cart has items */}
            {cart.length > 0 && (
              <div className="shrink-0 px-4 pb-4 pt-2 fixed bottom-0 left-0 right-0 border-t border-[#2c1a10] bg-[#150e08]">
                <button
                  onClick={() => setMobileView("cart")}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-[#c8924a] text-[#1a100a] text-[12px] font-black shadow-lg shadow-[#c8924a]/30 active:scale-[0.97] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={15} />
                    <span>View Order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1a100a] text-[#c8924a] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                    <span className="font-black">
                      {total.toLocaleString()} Frw
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CART VIEW ── */}
        {mobileView === "cart" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <CartPanel isMobile={true} />
          </div>
        )}
      </div>
    </>
  );
}
