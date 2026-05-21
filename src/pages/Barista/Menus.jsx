import React, { useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";

export default function BaristMenus() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cappuccino",
      category: "Hot Coffee",
      price: 2000,
      available: true,
    },
    {
      id: 2,
      name: "Cafe Latte",
      category: "Hot Coffee",
      price: 2000,
      available: true,
    },
    {
      id: 3,
      name: "Espresso",
      category: "Hot Coffee",
      price: 1500,
      available: true,
    },
    {
      id: 4,
      name: "Frappuccino Coffee",
      category: "Cold Coffee",
      price: 3000,
      available: false,
    },
  ]);

  const toggleAvailability = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)),
    );
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-black">Menu Availability Control</h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Toggle catalog stock indicators
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-black rounded-xl transition-all hover:bg-gray-800 active:scale-95">
            <Plus size={12} /> New Product
          </button>
        </div>

        {/* Dense Functional Table Grid */}
        <div className="flex-1 overflow-y-auto mt-3 min-h-0 border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-[11px]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-3 text-gray-500">{product.category}</td>
                  <td className="p-3 text-right text-gray-900">
                    {product.price.toLocaleString()} Frw
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${product.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {product.available ? "In Stock" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleAvailability(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[10px] transition-all active:scale-95 ${product.available ? "border-gray-200 hover:bg-gray-100 text-gray-700" : "border-black bg-black text-white"}`}
                    >
                      {product.available ? (
                        <EyeOff size={11} />
                      ) : (
                        <Eye size={11} />
                      )}
                      {product.available ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
