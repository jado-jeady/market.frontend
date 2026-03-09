import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const TransactionHistory = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [filterOption, setFilterOption] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("");


  const fetchTransactions = async (signal) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/sales/my-sale",
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
          signal,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.data);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch transactions:", error);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTransactions(controller.signal);

    return () => controller.abort();
  }, [user]);

  // 🔥 FILTER LOGIC
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Search by customer name or ID
    if (search) {
      filtered = filtered.filter((txn) =>
        txn.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        txn.id.toString().includes(search)
      );
    }

    // Filter option (example: Old/Newer/Pending)
    if (filterOption === "Old") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (filterOption === "Newer") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (filterOption === "Pending") {
      filtered = filtered.filter((txn) => txn.status === "PENDING");
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((txn) =>
        txn.created_at.startsWith(selectedDate)
      );
    }

    return filtered;
  };
  

  const resetFilters = () => {
    setSearch("");
    setFilterOption("All Categories");
    setSelectedDate("");
  };

  const filteredTransactions = getFilteredTransactions();

              console.log(filteredTransactions);
  return (
    <div className="p-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
        <p className="text-gray-600 text-xs mt-1">
          View all past transactions
        </p>
      </div>

      {/* Filters */}
      <div className=" rounded-lg shadow-md p-1 mb-2">
        <div className="grid grid-cols-1 text-gray-500 text-xs md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 h-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />

          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="px-2 py-1 border h-7 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option>All Categories</option>
            <option>Old</option>
            <option>Newer</option>
            <option>Pending</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 h-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />

          <button
            onClick={resetFilters}
            className="px-2 py-1 h-7 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r text-gray-500 from-primary-600 to-secondary-600 ">
            <tr>
              <th className="px-2 py-2 text-left font-semibold">ID</th>
              <th className="px-2 py-2 text-left font-semibold">Invoice #</th>
              <th className="px-2 py-2 text-left font-semibold">
                Customer
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                Amount
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                Payment
              </th>
              
              <th className="px-2 py-2 text-left font-semibold">
                Item List
              </th>
              
              <th className="px-2 py-2 text-left font-semibold">
                Payment
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                Date & Time
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y text-xs text-gray-500 divide-gray-200">
            {filteredTransactions && filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 font-medium">
                    {txn.id}
                  </td>
                  <td className="px-2 py-2">
                    {txn.invoice_number}
                  </td>
                  <td className="px-2 py-2">
                    {txn.customer_name || "Walk-in"}
                  </td>
                  <td className="px-2 py-2 font-semibold">
                    {txn.subtotal}
                  </td>
                  <td className="px-2 py-2">
                    {txn.payment_method}
                  </td>
                  
                  <td className="px-2 py-2">
                    {txn.items.map((products)=>(
                      <p >{products.product_name }<br/></p>
                    ))}
                    </td>

                    <td className="px-2 py-2">
                    {txn.status}
                  </td>
                  

                  <td className="px-2 py-2">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                  
                  
                  
                  
                  <td className="px-2 py-2">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;