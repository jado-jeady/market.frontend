import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getAllSales } from "../../utils/sales.util.js";
import { getAllProducts } from "../../utils/product.util.js";
import { getUsers } from "../../utils/user.util.js";
import { getAllCategories as getCategories } from "../../utils/category.util.js";
import { getShiftBusinessDates as getShifts } from "../../utils/shift.util.js";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("week"); // day, week, month, year

  const [stats, setStats] = useState({
    totalSales: 0,
    totalStock: 0,
    lowStock: 0,
    totalUsers: 0,
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesByCategory: [],
    salesTrend: [],
    recentActivities: [],
  });

  // Colors for charts
  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("rw-FR", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number with commas
  const formatNumber = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (previous === 0) return "+100%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const [salesRes, productsRes, usersRes, categoriesRes, shiftsRes] =
        await Promise.all([
          getAllSales({ limit: 10000 }),
          getAllProducts({ limit: 10000 }),
          getUsers(),
          getCategories(),
          getShifts({ limit: 100 }),
        ]);

      const allSales = salesRes?.data || [];
      const allProducts = productsRes?.data || [];
      const lowStockItems = allProducts.filter(
        (p) => p.stock_quantity <= (p.low_stock_threshold || 5),
      );
      const allUsers = usersRes?.data || [];
      const allCategories = categoriesRes?.data || [];
      const allShifts = shiftsRes?.data || [];

      // Calculate total sales amount
      const totalSalesAmount = allSales.reduce(
        (sum, sale) => sum + Number(sale.subtotal || 0),
        0,
      );

      // Calculate total stock quantity
      const totalStockQuantity = allProducts.reduce(
        (sum, product) => sum + Number(product.stock_quantity || 0),
        0,
      );

      // Today's sales
      const today = new Date().toISOString().split("T")[0];
      const todaySales = allSales
        .filter((sale) => sale.created_at?.startsWith(today))
        .reduce((sum, sale) => sum + Number(sale.subtotal || 0), 0);

      // Weekly sales
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklySales = allSales
        .filter((sale) => new Date(sale.created_at) >= oneWeekAgo)
        .reduce((sum, sale) => sum + Number(sale.subtotal || 0), 0);

      // Monthly sales
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlySales = allSales
        .filter((sale) => new Date(sale.created_at) >= oneMonthAgo)
        .reduce((sum, sale) => sum + Number(sale.subtotal || 0), 0);

      // Average order value
      const averageOrderValue =
        allSales.length > 0 ? totalSalesAmount / allSales.length : 0;

      // Top products by sales
      const productSales = {};
      allSales.forEach((sale) => {
        if (sale.items) {
          sale.items.forEach((item) => {
            const productName = item.product?.name || "Unknown";
            if (!productSales[productName]) {
              productSales[productName] = {
                name: productName,
                quantity: 0,
                revenue: 0,
              };
            }
            productSales[productName].quantity += item.quantity;
            productSales[productName].revenue +=
              item.quantity * item.unit_price;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Sales by category
      const categorySales = {};
      allSales.forEach((sale) => {
        if (sale.items) {
          sale.items.forEach((item) => {
            const categoryName =
              item.product?.category?.name || "Uncategorized";
            if (!categorySales[categoryName]) {
              categorySales[categoryName] = 0;
            }
            categorySales[categoryName] += item.quantity * item.unit_price;
          });
        }
      });

      const salesByCategory = Object.entries(categorySales).map(
        ([name, value]) => ({
          name,
          value,
        }),
      );

      // Sales trend (last 7 days)
      const salesTrend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const daySales = allSales
          .filter((sale) => sale.created_at?.startsWith(dateStr))
          .reduce((sum, sale) => sum + Number(sale.subtotal || 0), 0);

        salesTrend.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          fullDate: dateStr,
          sales: daySales,
          transactions: allSales.filter((sale) =>
            sale.created_at?.startsWith(dateStr),
          ).length,
        });
      }

      // Recent activities
      const recentActivities = [
        ...allSales.slice(0, 5).map((sale) => ({
          action: `New sale #${sale.invoice_number}`,
          time: new Date(sale.created_at).toLocaleString(),
          type: "sale",
          amount: sale.subtotal,
          user: sale.user?.full_name,
        })),
        ...allProducts
          .filter((p) => p.stock_quantity <= (p.low_stock_threshold || 5))
          .slice(0, 3)
          .map((p) => ({
            action: `Low stock alert: ${p.name}`,
            time: "Just now",
            type: "stock",
            quantity: p.stock_quantity,
          })),
        ...allShifts.slice(0, 3).map((shift) => ({
          action: `Shift ${shift.status}`,
          time: new Date(shift.created_at).toLocaleString(),
          type: "shift",
          cashier: shift.user?.full_name,
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);

      setStats({
        totalSales: totalSalesAmount,
        totalStock: totalStockQuantity,
        lowStock: lowStockItems.length,
        totalUsers: allUsers.length,
        todaySales,
        weeklySales,
        monthlySales,
        averageOrderValue,
        topProducts,
        salesByCategory,
        salesTrend,
        recentActivities,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set fallback data if needed
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalSales),
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      change: calculateChange(stats.totalSales, stats.totalSales * 0.9),
      subtitle: "Lifetime sales",
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      change: calculateChange(stats.todaySales, stats.todaySales * 0.8),
      subtitle: "Current day",
    },
    {
      title: "Total Stock",
      value: formatNumber(stats.totalStock),
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+5.2%",
      subtitle: "Items in inventory",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      change: "-3.1%",
      subtitle: "Need reorder",
    },
    {
      title: "Total Cashiers",
      value: stats.totalUsers,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      change: "+8.3%",
      subtitle: "Active staff",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(stats.averageOrderValue),
      icon: TrendingUp,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
      change: "+12.5%",
      subtitle: "Per transaction",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Dashboard</h3>
          <p className="text-xs text-gray-600">
            Welcome back! Here's what's happening with your Shop today.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center text-gray-700 gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="px-2 py-1 text-gray-800 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change.startsWith("+");

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 ${card.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                    isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {card.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
              <p className="text-lg font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Sales
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Transactions
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorTransactions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "sales" ? formatCurrency(value) : value,
                    name === "sales" ? "Sales" : "Transactions",
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="Sales"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorTransactions)"
                  name="Transactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.salesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topProducts}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue" ? "Revenue" : "Quantity",
                  ]}
                />
                <Legend />
                <Bar dataKey="quantity" fill="#f59e0b" name="Quantity Sold" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Monthly Sales</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats.monthlySales)}
              </p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Weekly Sales</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats.weeklySales)}
              </p>
              <p className="text-xs text-gray-500 mt-1">vs last week</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Total Products</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(stats.totalStock)}
              </p>
              <p className="text-xs text-gray-500 mt-1">in stock</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Low Stock</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {stats.lowStock}
              </p>
              <p className="text-xs text-gray-500 mt-1">items need attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activities
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {stats.recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "sale"
                      ? "bg-green-500"
                      : activity.type === "stock"
                        ? "bg-blue-500"
                        : activity.type === "shift"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <span className="text-gray-700">{activity.action}</span>
                  {activity.amount && (
                    <span className="ml-2 text-sm font-semibold text-green-600">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                  {activity.user && (
                    <span className="ml-2 text-xs text-gray-500">
                      by {activity.user}
                    </span>
                  )}
                  {activity.quantity && (
                    <span className="ml-2 text-xs text-yellow-600">
                      Qty: {activity.quantity}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
