import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { AdminRoutes } from "./routes/AdminRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { StorekeeperRoutes } from "./routes/StoreKeeperRoutes";
import { BaristaRoutes } from "./routes/BarisataRoutes";

// Register service worker update check
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for updates every 30 seconds
        setInterval(() => {
          registration.update();
        }, 30000);

        // Detect when new service worker is waiting
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content available, prompt user to refresh
              if (confirm("New version available! Refresh to update?")) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((err) => console.error("SW registration failed:", err));
  });
}

function App() {
  // Register service worker update check
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates every 30 seconds
          setInterval(() => {
            registration.update();
          }, 30000);

          // Detect when new service worker is waiting
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content available, prompt user to refresh
                if (confirm("New version available! Refresh to update?")) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((err) => console.error("SW registration failed:", err));
    });
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        <Route path="/" element={<Login />} />
        {AdminRoutes}
        {UserRoutes}
        {BaristaRoutes}
        {StorekeeperRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
