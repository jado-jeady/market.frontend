import React from "react";

export default function Dashboard() {
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
    {
      id: 1,
      name: "Cappuccino",
      category: "Hot Coffee",
      price: 2000,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Cafe Latte",
      category: "Hot Coffee",
      price: 2000,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Espresso",
      category: "Hot Coffee",
      price: 1500,
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Mango Juice",
      category: "Juices",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Frappuccino Coffee",
      category: "Cold Coffee",
      price: 3000,
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Fruit Salad",
      category: "Fruits",
      price: 3000,
      image:
        "https://images.unsplash.com/photo-1564093497595-593b96d80180?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const API_URL = import.meta.env.VITE_API_URL;

  const { useMemo, useState } = React;

  const [selectedCategory, setSelectedCategory] = useState("Hot Coffee");
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

      // SAVE ORDER
      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      // SEND TO LOCAL PRINT SERVER
      await fetch("http://192.168.1.10:4000/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden text-gray-800">
      {/* LEFT SIDEBAR */}
      <div className="w-52 bg-white border-r border-gray-200 p-3 flex flex-col">
        <div className="mb-5">
          <h1 className="text-xl font-black tracking-tight">TYGA BARISTA</h1>
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Tablet Ordering System
          </p>
        </div>

        <div className="space-y-2 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">{selectedCategory}</h2>
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Select customer items
            </p>
          </div>

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black"
          />
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-xl transition-all active:scale-95"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover"
              />

              <div className="p-4 text-left">
                <h3 className="font-black text-sm mb-1">{product.name}</h3>

                <p className="text-xs text-gray-400 uppercase mb-3">
                  {product.category}
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-black text-lg">
                    {product.price.toLocaleString()} RWF
                  </span>

                  <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-bold">
                    ADD
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-black mb-1">Current Order</h2>
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Customer Selection
          </p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
            Table Number (Optional)
          </label>

          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Example: A2"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && (
            <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm font-medium">
              No items selected
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-black text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-400 uppercase">
                    {item.price.toLocaleString()} RWF
                  </p>
                </div>

                <p className="font-black text-sm">
                  {(item.price * item.quantity).toLocaleString()} RWF
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-300 font-black text-lg"
                  >
                    -
                  </button>

                  <span className="w-10 text-center font-black text-lg">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-9 h-9 rounded-xl bg-black text-white font-black text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-bold uppercase text-sm">
              Total
            </span>

            <span className="text-3xl font-black">
              {total.toLocaleString()} RWF
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearCart}
              className="py-4 rounded-2xl bg-gray-200 hover:bg-gray-300 font-black text-sm"
            >
              CLEAR
            </button>

            <button
              onClick={submitOrder}
              disabled={loading}
              className="py-4 rounded-2xl bg-black hover:bg-gray-800 text-white font-black text-sm disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "PRINT ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
