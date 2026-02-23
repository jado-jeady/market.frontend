import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ShiftProvider } from './context/ShiftContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
       <ShiftProvider>
      <App />
      </ShiftProvider>
    </AuthProvider>
  </React.StrictMode>,
)