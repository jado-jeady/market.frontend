// utils/report.util.js

const API_URL = `${import.meta.env.VITE_API_URL}`;
const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
// Que

// Generate Sales Report
export const generateSalesReport = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/generate/sales`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating sales report:", error);
    return { success: false, message: error.message };
  }
};

// Generate Stock Report
export const generateStockReport = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/generate/stock`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating stock report:", error);
    return { success: false, message: error.message };
  }
};

// Generate Financial Report
export const generateFinancialReport = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/generate/financial`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating financial report:", error);
    return { success: false, message: error.message };
  }
};

// Generate Customer Report
export const generateCustomerReport = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/generate/customer`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating customer report:", error);
    return { success: false, message: error.message };
  }
};

// Generate Category Report
export const generateCategoryReport = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/generate/category`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating category report:", error);
    return { success: false, message: error.message };
  }
};

// Download Report Excel
export const downloadReportExcel = async (reportId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/reports/download/${reportId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Error downloading report:", error);
    return { success: false, message: error.message };
  }
};

// Get All Reports
export const getAllReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/api/reports?${params}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { success: false, data: [] };
  }
};

// Get Report by ID
export const getReportById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/${id}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching report:", error);
    return { success: false };
  }
};
