import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import Sales from './pages/admin/Sales';
import Stock from './pages/admin/Stock';
import Report from './pages/admin/Report';
import Management from './pages/admin/Management';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="stock/*" element={<Stock />} />
          <Route path="report" element={<Report />} />
          <Route path="management/*" element={<Management />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;