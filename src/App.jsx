import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import { AdminRoutes } from "./routes/AdminRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { StorekeeperRoutes } from "./routes/StoreKeeperRoutes";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        <Route path="/" element={<Login />} />
        {AdminRoutes}
        {UserRoutes}
        {StorekeeperRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;