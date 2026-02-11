const BASE_URL = import.meta.env.VITE_API_URL;
const SALES_BASE = `${BASE_URL}/api/sales`;
const MY_SALES_BASE = `${BASE_URL}/api/sales/my-sale`;
const USERS_BASE = `${BASE_URL}/api/users`;

/* ===================== HELPERS ===================== */

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

const buildQueryParams = (filters = {}) =>
  new URLSearchParams(
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== ''
    )
  ).toString();



/* ===================== GET MY SALES (CASHIER) ===================== */
export const getMySales = async (filters = {}) => {
  try {

    const params = new URLSearchParams();

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;

    params.append('page', page);
    params.append('limit', limit);

    if (filters.start_date)
      params.append('start_date', filters.start_date);

    if (filters.end_date)
      params.append('end_date', filters.end_date);

    if (filters.payment_method)
      params.append('payment_method', filters.payment_method);

    if (filters.status)
      params.append('status', filters.status);

    console.log(
      `URL: ${MY_SALES_BASE}?${params.toString()}`
    );

    const res = await fetch(
      `${MY_SALES_BASE}?${params.toString()}`,
      {
        headers:getAuthHeaders()
      }
    );

    const data = await res.json();
    if (!res.ok) throw data;

    return data;

  } catch (error) {
    console.error('Get my sales error:', error);
    return {
      success: false,
      message: 'Failed to fetch sales'
    };
  }
};

/* ===================== CREATE SALE (CASHIER) ===================== */

export const createSale = async (payload) => {
  try {
    const res = await fetch(SALES_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Create sale error:', error);
    return { success: false, message: error?.message };
  }
};

/* ===================== GET ALL SALES (ADMIN) ===================== */
/**
 * filters:
 * page, limit, start_date, end_date,
 * payment_method, cashier_id, status
 */
export const getAllSales = async (filters = {}) => {
  try {
    const params = buildQueryParams(filters);
    const res = await fetch(`${SALES_BASE}?${params}`, {
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Get all sales error:', error);
    return { success: false, message: 'Failed to fetch sales' };
  }
};

/* ===================== GET SALE BY ID ===================== */

export const getSaleById = async (saleId) => {
  try {
    const res = await fetch(`${SALES_BASE}/${saleId}`, {
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Get sale by ID error:', error);
    return { success: false, message: 'Failed to fetch sale details' };
  }
};

/* ===================== CONFIRM SALE RETURN (ADMIN) ===================== */

export const confirmSaleReturn = async (saleId) => {
  try {
    const res = await fetch(`${SALES_BASE}/${saleId}/return`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Confirm return error:', error);
    return { success: false, message: 'Failed to confirm return' };
  }
};

/* ===================== GET CASHIERS (ADMIN) ===================== */

export const getCashiers = async () => {
  try {
    const res = await fetch(`${USERS_BASE}?role=CASHIER`, {
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Get cashiers error:', error);
    return { success: false, message: 'Failed to fetch cashiers' };
  }
};

/* ===================== SALES SUMMARY ===================== */

export const getSalesSummary = async () => {
  try {
    const res = await fetch(`${SALES_BASE}/summary`, {
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Sales summary error:', error);
    return { success: false, message: 'Failed to load sales summary' };
  }
};

/* ===================== TODAY SALES ===================== */

export const getTodaySales = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`${MY_SALES_BASE}?start_date=${today}`, {
      headers: getAuthHeaders()
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Today sales error:', error);
    return { success: false, message: 'Failed to fetch today sales' };
  }
};

/* ===================== SALES BY PAYMENT METHOD ===================== */

export const getSalesByPaymentMethod = async (paymentMethod) => {
  try {
    const res = await fetch(
      `${MY_SALES_BASE}?payment_method=${paymentMethod}`,
      { headers: getAuthHeaders() }
    );

    return await handleResponse(res);
  } catch (error) {
    console.error('Sales by payment error:', error);
    return { success: false, message: 'Failed to fetch sales by payment method' };
  }
};
