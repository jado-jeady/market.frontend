import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodaySales, getMySales } from "../../utils/sales.util";
import { getAllProducts } from "../../utils/product.util";
import LowStockAlerts from "./Consumables/LowStockAlerts";

const UserDashboard = () => {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecentSales, setLoadingRecentSales] = useState(true);
  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState([]);

  const [stats, setStats] = useState({
    todaySales: 0,
    totalTransactions: 0,
    lowStockItems: 0,
    bestItemname: "",
    bestItemquantity: 0,
    topCustomername: "",
    topCustomerpurchase: 0,
  });

  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        /* ================= TODAY SALES ================= */
        setLoadingStats(true);
        const todaySalesRes = await getTodaySales();
        const todaySalesList = todaySalesRes?.data || [];
        const todayTotal = todaySalesList.reduce(
          (sum, sale) => sum + Number(sale.subtotal || 0),
          0,
        );

        /* ================= BEST SELLING ITEM ================= */
        let bestItem = null;
        const productSalesMap = {};
        todaySalesList.forEach((sale) => {
          sale.items?.forEach((item) => {
            if (!productSalesMap[item.product_id]) {
              productSalesMap[item.product_id] = {
                name: item.product_name,
                quantity: 0,
              };
            }
            productSalesMap[item.product_id].quantity += Number(item.quantity);
          });
        });
        const sortedProducts = Object.values(productSalesMap).sort(
          (a, b) => b.quantity - a.quantity,
        );
        if (sortedProducts.length > 0) bestItem = sortedProducts[0];

        /* ================= TOP CUSTOMER ================= */
        let topCustomer = null;
        const customerSalesMap = {};
        todaySalesList.forEach((sale) => {
          const customerName = sale.customer_name || "Walk-in";
          if (!customerSalesMap[customerName]) {
            customerSalesMap[customerName] = { name: customerName, total: 0 };
          }
          customerSalesMap[customerName].total += Number(sale.subtotal || 0);
        });
        const sortedCustomers = Object.values(customerSalesMap).sort(
          (a, b) => b.total - a.total,
        );
        if (sortedCustomers.length > 0) topCustomer = sortedCustomers[0];

        setStats((prev) => ({
          ...prev,
          todaySales: todayTotal,
          totalTransactions: todaySalesList.length,
          bestItemname: bestItem?.name || "",
          bestItemquantity: bestItem?.quantity || 0,
          topCustomername: topCustomer?.name || "",
          topCustomerpurchase: topCustomer?.total || 0,
        }));
        setLoadingStats(false);

        /* ================= MY SALES (RECENT) ================= */
        setLoadingRecentSales(true);
        const recentSalesRes = await getMySales({ page: 1, limit: 5 });
        console.log("Recent sales response:", recentSalesRes);
        setRecentSales(recentSalesRes?.data || []);
        setLoadingRecentSales(false);

        /* ================= OUT OF STOCK ================= */
        setLoadingLowStock(true);
        const productsRes = await getAllProducts({ out_of_stock: true });
        console.log("Low stock response:", productsRes);
        const products = productsRes?.data || [];

        const lowStockCount = products.length;
        setOutOfStock(products);

        /* ================= LOW OF STOCK ================= */
        

        setStats((prev) => ({ ...prev, lowStockItems: lowStockCount }));
        setLoadingLowStock(false);
      } catch (error) {
        console.error("Dashboard load error:", error);
        setLoadingStats(false);
        setLoadingRecentSales(false);
        setLoadingLowStock(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Cashier Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of today's activity</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {/* Today Sales */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Today's Sales</p>
          {loadingStats ? (
            <p className="text-xs text-gray-400 mt-2">Loading...</p>
          ) : (
            <h3 className="text-sm font-bold text-green-600 mt-2">
              {stats.todaySales.toLocaleString() || `0`} RWF
            </h3>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Today's Transactions</p>
          {loadingStats ? (
            <p className="text-xs text-gray-400 mt-2">Loading...</p>
          ) : (
            <h3 className="text-sm font-bold text-blue-600 mt-2">
              {stats.totalTransactions || `No sale made`}
            </h3>
          )}
        </div>

        {/* Best Selling Item */}
        <div className="shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Fast move Items</p>
          {loadingStats ? (
            <p className="text-xs text-gray-400 mt-2">Loading...</p>
          ) : (
            <h3 className="text-sm font-bold mt-2">
              <span className="text-xs text-green-500">
                {stats.bestItemname || "Not applicable"}
              </span>
              <span className="bg-gray-700 p-1 pl-1 pr-2 rounded-lg text-white text-[9px] ml-7">
                {stats.bestItemquantity} pcs
              </span>
            </h3>
          )}
        </div>

        {/* Top Customer */}
        <div className="bg-white shadow rounded-lg pt-5 p-3">
          <p className="text-sm text-gray-500">Loyal Customer</p>
          {loadingStats ? (
            <p className="text-xs text-gray-400 mt-2">Loading...</p>
          ) : (
            <h3 className="text-sm font-bold mt-2">
              <span className="text-xs text-green-500">
                {stats.topCustomername || "None"}
              </span>
              <span className="bg-gray-700 p-1 rounded-lg text-white text-[10px] ml-7">
                {stats.topCustomerpurchase} Frw
              </span>
            </h3>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Low Stock Products</p>
          {loadingLowStock ? (
            <p className="text-xs text-gray-400 mt-2">Loading...</p>
          ) : (
            <h3 className="text-sm font-bold text-yellow-600 mt-2">
              {stats.lowStockItems}
            </h3>
          )}
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Link
          to="/user/sales/new"
          className="hover:bg-gray-200 border-1 text-white rounded-lg p-6 text-center hover:bg-primary-700 transition"
        >
          New Sale
        </Link>
        <Link
          to="/user/products"
          className="hover:bg-gray-200 text-white rounded-lg border-1 p-6 text-center hover:bg-secondary-700 transition"
        >
          View Products
        </Link>
        <Link
          to="/user/reports"
          className="hover:bg-gray-200 border-1 text-white rounded-lg p-6 text-center hover:bg-blue-700 transition"
        >
          View Reports
        </Link>
      </div>

      {/* ================= LOW STOCK & RECENT SALES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ================= Low Stock ================= */}
        <div className="bg-white text-gray-700 shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Low stock items</h3>
          {loadingLowStock ? (
            <p className="text-gray-400 text-sm">Loading low stock items...</p>
          ) : outOfStock.length === 0 ? (
            <p className="text-gray-500 text-sm">No low stock items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStock.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.stock_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= out of stock items ================= */}
        <div className="bg-white text-gray-700 shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Out of Stock Items</h3>
          {loadingLowStock ? (
            <p className="text-gray-400 text-sm">
              Loading out of stock items...
            </p>
          ) : outOfStock.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No out of stock items found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStock.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.stock_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= RECENT SALES ================= */}
      <div className="bg-white text-gray-700 shadow rounded-lg p-5 mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {loadingRecentSales ? (
          <p className="text-gray-400 text-sm">Loading recent sales...</p>
        ) : recentSales.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent sales found.</p>
        ) : (
          <div className="overflow-x-auto max-w-lg">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b">
                    <td className="px-4 text-xs py-2">{sale.invoice_number}</td>
                    <td className="px-4 py-2">{sale?.items.length}</td>
                    <td className="px-4 py-2">{sale.customerName}</td>
                    <td className="px-4 py-2">
                      {sale.created_at.split("T")[0]}
                    </td>
                    <td className="px-4 py-2">{sale.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
