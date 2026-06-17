import React, { useState } from "react";
import { Search, UserPlus, Phone, Award, CreditCard, X } from "lucide-react";

export default function BaristaCustomers() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Local reactive states for new customer form
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: "CUST-101",
      name: "David Mugisha",
      phone: "+250 788 123 456",
      points: 240,
      balance: 15000,
    },
    {
      id: "CUST-102",
      name: "Aline Umutoni",
      phone: "+250 789 987 654",
      points: 85,
      balance: 0,
    },
    {
      id: "CUST-103",
      name: "Jean-Paul Ntwari",
      phone: "+250 783 445 566",
      points: 410,
      balance: 3500,
    },
    {
      id: "CUST-104",
      name: "Fiona Keza",
      phone: "+250 785 112 233",
      points: 15,
      balance: 0,
    },
  ]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCust = {
      id: `CUST-${100 + customers.length + 1}`,
      name: newName,
      phone: newPhone,
      points: 0,
      balance: 0,
    };

    setCustomers([newCust, ...customers]);
    setNewName("");
    setNewPhone("");
    setShowModal(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3 relative">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        {/* Header Block Section */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-black">Customer Accounts</h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Manage customer directory accounts and credit metrics
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-black rounded-xl transition-all hover:bg-gray-800 active:scale-95 shadow-sm"
          >
            <UserPlus size={12} /> Register Client
          </button>
        </div>

        {/* Directory Filtering Search bar */}
        <div className="my-3 relative shrink-0">
          <input
            type="text"
            placeholder="Search account by name or phone code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-black text-[11px]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Directory Content Scroller view */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-gray-900 text-[11px]">
                    {customer.name}
                  </h4>
                  <span className="text-[8px] font-black bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md">
                    {customer.id}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-medium">
                  <Phone size={10} />
                  <span>{customer.phone}</span>
                </div>
              </div>

              {/* Reward Points and Accounts Tab Tracking metrics indicators */}
              <div className="flex items-center gap-3 font-semibold text-[10px] self-end sm:self-auto">
                <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Award size={12} className="text-amber-500" />
                  <div>
                    <span className="text-[8px] text-gray-400 block font-bold uppercase leading-none">
                      Points
                    </span>
                    <span className="text-gray-900 font-black">
                      {customer.points}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CreditCard
                    size={12}
                    className={
                      customer.balance > 0 ? "text-red-500" : "text-gray-400"
                    }
                  />
                  <div>
                    <span className="text-[8px] text-gray-400 block font-bold uppercase leading-none">
                      Due Balance
                    </span>
                    <span
                      className={`font-black ${customer.balance > 0 ? "text-red-600" : "text-gray-900"}`}
                    >
                      {customer.balance.toLocaleString()} Frw
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="flex items-center justify-center text-gray-400 font-medium h-32">
              No matching client logs detected
            </div>
          )}
        </div>
      </div>

      {/* ── POPUP COMPONENT INTERFACE MODAL ── */}
      {showModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm p-4 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-gray-900">
                New Client Profile
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide block">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marie Claire"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-black text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide block">
                  Mobile Phone Node
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +250 78..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-black text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all text-center text-[10px]"
              >
                Initialize Account Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
