const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const buildQS = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  ).toString();

const fetchJSON = async (url) => {
  const res = await fetch(url, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const getSalesReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/sales?${buildQS(params)}`);

export const getProfitReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/profit?${buildQS(params)}`);

export const getVatReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/vat?${buildQS(params)}`);

export const getShiftReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/shifts?${buildQS(params)}`);

export const getStockMovementReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/stock-movements?${buildQS(params)}`);

export const getPurchaseReport = (params) =>
  fetchJSON(`${API_URL}/api/reports/purchases?${buildQS(params)}`);

export const getReportFilters = () =>
  fetchJSON(`${API_URL}/api/reports/filters`);
