import React, { useMemo, useState } from "react";
import BaristaSidebar from "../../components/BaristaSidebar";

export default function Sell() {
  // State logic that drives the popup visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* --- Keeping your exact original state logic down below --- */
  const [selectedCategory, setSelectedCategory] = useState("Hot Coffee");
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const categories = [
    "Hot Coffee",
    "Cold Coffee",
    "Tea",
    "Juices",
    "Smoothies",
    "Milkshakes",
    "Mojito",
    "Fruits",
  ];
  const products = [
    { id: 1, name: "Cappuccino", category: "Hot Coffee", price: 2000 },
    { id: 2, name: "Cafe Latte", category: "Hot Coffee", price: 2000 },
    { id: 3, name: "Espresso", category: "Hot Coffee", price: 1500 },
    { id: 4, name: "Cappuccino", category: "Tea", price: 2000 },
    { id: 5, name: "Cafe Latte", category: "Tea", price: 2000 },
    { id: 6, name: "Espresso", category: "Tea", price: 1500 },
    { id: 7, name: "Cappuccino", category: "Juices", price: 2000 },
    { id: 8, name: "Cafe Latte", category: "Juices", price: 2000 },
    { id: 9, name: "Espresso", category: "Juices", price: 1500 },
    { id: 10, name: "Cappuccino", category: "Mojito", price: 2000 },
    { id: 11, name: "Cafe Latte", category: "Mojito", price: 2000 },
    { id: 12, name: "Espresso", category: "Hot Coffee", price: 1500 },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.category === selectedCategory &&
        p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [selectedCategory, search]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const clearCart = () => {
    setCart([]);
    setTableNumber("");
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert("Add items first");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        tableNumber,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        total,
        status: "pending",
      };

      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.message);

      await fetch("http://192.168.1.10:4000/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderData.data.orderNumber,
          tableNumber,
          items: payload.items,
          total,
        }),
      });

      alert("Order sent successfully");
      clearCart();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden text-gray-800 text-xs relative">
      {/* ── ANCHORED FLOATING HAMBURGER DROPDOWN CONTAINER ── */}
      {/* Placed inside an absolute wrapper to maintain consistent popup coordinate metrics */}

      {/* ── LEFT SIDEBAR: CATEGORIES ── */}
      <div className="w-44 bg-white border-r border-gray-200 pt-14 pb-3 px-2 flex flex-col shrink-0">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
          Categories
        </p>
        <div className="space-y-1 overflow-y-auto flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-all text-[11px] ${
                selectedCategory === cat
                  ? "bg-black text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS VIEW AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Search panel (indents content padding to make space for the floating hamburger) */}
        <div className="bg-white border-b border-gray-200 pl-14 pr-4 py-3 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-base font-black">{selectedCategory}</h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Select customer items
            </p>
          </div>
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black text-[11px]"
          />
        </div>

        {/* Product Cards Content Scroller */}
        <div className="flex-1 p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-gray-50 content-start overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-md transition-all active:scale-95 h-fit flex flex-col text-left"
            >
              <div className="p-3 flex flex-col justify-between min-h-[85px]">
                <div>
                  <h3 className="font-bold text-[11px] mb-0.5 text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[9px] text-gray-400 uppercase truncate">
                    {product.category}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <span className="font-black text-[10px] text-gray-900">
                    {product.price.toLocaleString()} Frw
                  </span>
                  <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                    + Add
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── PERMANENTLY STICKY FOOTER CART PANEL ── */}
      <div className="w-52 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shrink-0">
        <div className="px-3 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-[11px] font-black">Current Order</h2>
          <p className="text-[9px] text-gray-400 font-semibold">
            Customer Selection
          </p>
        </div>

        {/* Items List scroll view container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl p-2 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="font-black text-[10px] truncate">
                    {item.name}
                  </h3>
                  <p className="text-[9px] text-gray-400">
                    {item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p className="font-black text-[10px]">
                  {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-6 h-5 rounded-lg bg-white border border-gray-300 font-black text-sm text-gray-600 leading-none"
                >
                  −
                </button>
                <span className="flex-1 text-center font-black text-[10px]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-6 h-5 bg-black text-white rounded-lg font-black text-sm leading-none"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Action Footer panel */}
        <div className="shrink-0 mt-auto border-t border-gray-200 px-3 py-3 bg-white space-y-2">
          <input
            type="text"
            placeholder="Table number..."
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-[10px] outline-none focus:border-black bg-gray-50"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-bold">Total</span>
            <span className="text-[11px] font-black">
              {total.toLocaleString()} RWF
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={clearCart}
              className="py-1.5 rounded-xl bg-gray-200 font-black text-[9px] text-gray-600"
            >
              Clear
            </button>
            <button
              onClick={submitOrder}
              disabled={loading}
              className="py-1.5 rounded-xl bg-black text-white font-black text-[9px]"
            >
              {loading ? "Sending…" : "Print & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
