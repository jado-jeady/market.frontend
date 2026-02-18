import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTodaySales,
  getMySales,
} from "../../Utils/sales.util"
import { getAllProducts } from "../../utils/product.util";
import LowStockAlerts from "./Stock/LowStockAlerts";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    todaySales: 0,
    totalTransactions: 0,
    lowStockItems: 0,
  });

  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        /* ================= TODAY SALES ================= */
        const todaySalesRes = await getTodaySales();

        const todaySalesList = todaySalesRes?.data || [];

        const todayTotal = todaySalesList.reduce(
          (sum, sale) => sum + Number(sale.total_amount || 0),
          0
        );

        /* ================= MY SALES (RECENT) ================= */
        const recentSalesRes = await getMySales({
          page: 1,
          limit: 5,
        });

        const mySalesList = recentSalesRes?.data || [];

        /* ================= LOW STOCK ================= */
        const productsRes = await getAllProducts();

        const products = productsRes?.data || [];

        const lowStockCount = products.filter(
          (p) =>
            Number(p.stock_quantity) <=
            Number(p.min_stock_level || 5)
        ).length;

        /* ================= SET STATE ================= */
        setStats({
          todaySales: todayTotal,
          totalTransactions: todaySalesList.length,
          lowStockItems: lowStockCount,
        });

        setRecentSales(mySalesList);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Cashier Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Overview of today's activity
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">

        {/* Today Sales */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Today's Sales</p>
          <h3 className="text-xl font-bold text-green-600 mt-2">
            {stats.todaySales.toLocaleString()} RWF
          </h3>
        </div>

        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Today's Transactions
          </p>
          <h3 className="text-xl font-bold text-blue-600 mt-2">
            {stats.totalTransactions}
          </h3>
        </div>
        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Today's Transactions
          </p>
          <h3 className="text-xl font-bold text-blue-600 mt-2">
            {stats.totalTransactions}
          </h3>
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Low Stock Products
          </p>
          <h3 className="text-xl font-bold text-yellow-600 mt-2">
            {stats.lowStockItems}
          </h3>
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
          className=" hover:bg-gray-200 text-white rounded-lg border-1 p-6 text-center hover:bg-secondary-700 transition"
        >
          View Products
        </Link>

        <Link
          to="/user/reports"
          className="hover:bg-gray-200 border-1  text-white rounded-lg p-6 text-center hover:bg-blue-700 transition"
        >
          View Reports
        </Link>
        

      </div>

      {/* ================= RECENT SALES ================= */}
      <div className="bg-white text-gray-700 shadow rounded-lg p-5 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h3>

        {recentSales.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No recent sales found.
          </p>
        ) : (
          <div className="space-y-3 text-gray-700">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <div>
                  <p className="font-medium text-sm">
                    Sale #{sale.id}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {new Date(
                      sale.created_at
                    ).toLocaleString()}
                  </p>
                </div>
                <p>{sale.toto}</p>

                <p className="font-semibold text-green-600">
                  {Number(
                    sale.total_amount
                  ).toLocaleString()} RWF
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= LOW STOCK TABLE ================= */}
      <div className="bg-white shadow rounded-lg p-5">
        <LowStockAlerts />
      </div>

    </div>
  );
};

export default UserDashboard;
