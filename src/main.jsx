import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import OfflineToast from "./components/reusables/OfflineToast.jsx";
import { ShiftProvider } from "./context/ShiftContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "react-toastify/dist/ReactToastify.css";

// Virtual import managed automatically by the vite-plugin-pwa framework bundle
import { registerSW } from "virtual:pwa-register";
// Automatically sets up the service worker pipeline
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OfflineToast />
    <AuthProvider>
      <ShiftProvider>
        <App />
      </ShiftProvider>
    </AuthProvider>
  </React.StrictMode>,
);
