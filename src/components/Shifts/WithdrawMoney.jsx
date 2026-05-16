import React, { useState } from "react";

export default function WithdrawModal({ shift, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const openingBalance = parseFloat(shift.opening_balance);

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    const withdrawAmount = parseFloat(value);

    // if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    //   setError("Please enter a valid amount.");
    //   return;
    // }

    if (withdrawAmount > openingBalance) {
      setError("Not enough balance in the shift.");
      return;
    }

    setError(""); // clear error if valid
  };

  const handleSubmit = () => {
    if (!error && amount) {
      onConfirm(parseFloat(amount));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          Withdraw Money
        </h2>

        <p className="text-sm text-slate-600 mb-2">
          Current Balance: <strong>{shift.opening_balance} RWF</strong>
        </p>

        <input
          type="number"
          value={amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className="w-full border rounded-md px-3 py-2 text-sm mb-3"
        />

        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!!error || !amount}
            className={`px-4 py-2 rounded-md text-white ${
              error || !amount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
