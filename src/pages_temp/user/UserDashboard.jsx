import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTodaySales,
  getMySales,
} from "../../utils/sales.util"
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
          (sum, sale) => sum + Number(sale.subtotal || 0),
          0
        );
        
        /* ================= MY SALES (RECENT) ================= */
        const recentSalesRes = await getMySales({
          page: 1,
          limit: 100000000,
        });

        const mySalesList = recentSalesRes?.data || [];
        
        /* ================= LOW STOCK ================= */
        const productsRes = await getAllProducts();

        const products = productsRes?.data || [];
        
        const lowStockCount = products.filter(
          (p) =>
            Number(p.stock_quantity) <=
            Number(p.min_stock || 5)
        ).length;

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
  (a, b) => b.quantity - a.quantity
);

if (sortedProducts.length > 0) {
  bestItem= sortedProducts[0]
}

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
  (a, b) => b.total - a.total
);

if (sortedCustomers.length > 0) {
  topCustomer = sortedCustomers[0];
  
}


        /* ================= SET STATs ================= */
        setStats({
          todaySales: todayTotal,
          totalTransactions: todaySalesList.length,
          lowStockItems: lowStockCount,
          bestItemname:bestItem.name,
          bestItemquantity: bestItem.quantity,
          topCustomername:topCustomer.name,
          topCustomerpurchase:topCustomer.total
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
          <h3 className="text-sm font-bold text-green-600 mt-2">
            {stats.todaySales.toLocaleString()} RWF
          </h3>
        </div>
        
        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Today's Transactions
          </p>
          <h3 className="text-sm font-bold text-blue-600 mt-2">
            {stats.totalTransactions}
          </h3>
        </div>
        {/* Best Sellign Item  */}
        <div className="shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Best Selling Item</p>
          <h3 className="text-sm font-bold  mt-2">
            <span className="text-xs text-green-500">{stats.bestItemname }</span>
            <span className="bg-gray-700 p-1 pl-1 pr-2 rounded-lg text-white text-[9px] ml-7 ">{stats.bestItemquantity} pcs<span></span> </span>
            </h3>
        </div>

        {/* Top Customer */}
        <div className="bg-white shadow rounded-lg pt-5 p-3">
          <p className="text-sm text-gray-500">
           Top Customer
          </p>
          <h3 className="text-sm font-bold  mt-2">
            <span className="text-xs text-green-500">{stats.topCustomername }</span>
            <span className="bg-gray-700 p-1 rounded-lg text-white text-[10px] ml-7 ">{stats.topCustomerpurchase} Frw</span>
            </h3>
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Low Stock Products
          </p>
          <h3 className="text-sm font-bold text-yellow-600 mt-2">
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
                  <p className="font-medium text-xs">
                    Sale #{sale.invoice_number}
                  </p>
                  
                  <p className="text-xs text-gray-500">
            {(() => {
    const created = new Date(sale.created_at);
    const now = new Date();
    const diffMs = now - created; // difference in milliseconds

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  })()}
</p>
                </div>
                {/* number of items on the transaction  */}
                <p className="text-sm">{sale.items.length} Items</p>
               
            <div className=" text-start align-content-center">
              {sale.items.map((item) => (
                <p className="text-xs" key={item.id}>
                  {item.product_name} = {item.quantity}
                </p>
              ))}
            {/* total Items and list */}
                <p className="font-bold text-[12px] p-0">
                  Total Items: {sale.items.reduce((sum, item) => sum + Number(item.quantity), 0)}
                </p>
                </div>

                <p className="font-semibold text-sm text-green-600">
                  {Number(
                    sale.subtotal
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
