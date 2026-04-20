const BASE_URL = import.meta.env.VITE_API_URL;
const SALES_BASE = `${BASE_URL}/api/sales`;
const MY_SALES_BASE = `${BASE_URL}/api/sales/my-sale`;
const USERS_BASE = `${BASE_URL}/api/users`;

/* ===================== HELPERS ===================== */
const getUserId = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  return authData?.data?.user?.id;
};

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const handleResponse = async (res) => {
  const data = await res.json(); // consume once
  if (!res.ok) throw data;
  return data;
};

const buildQueryParams = (filters = {}) =>
  new URLSearchParams(
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== "",
    ),
  ).toString();

/* ===================== GET MY SALES (CASHIER) ===================== */
export const getMySales = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;

    params.append("page", page);
    params.append("limit", limit);

    if (filters.start_date) params.append("start_date", filters.start_date);

    if (filters.end_date) params.append("end_date", filters.end_date);

    if (filters.payment_method)
      params.append("payment_method", filters.payment_method);

    if (filters.status) params.append("status", filters.status);

    console.log(`URL: ${MY_SALES_BASE}?${params.toString()}`);

    const res = await fetch(`${MY_SALES_BASE}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data;
  } catch (error) {
    console.error("Get my sales error:", error);
    return {
      success: false,
      message: "Failed to fetch sales",
    };
  }
};

/* ===================== CREATE SALE (CASHIER) ===================== */

export const createSale = async (payload) => {
  try {
    const res = await fetch(SALES_BASE, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Create sale error:", error);
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
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(res); // ✅ only once
    console.log("Sales response:", data); // log the parsed data, not res.json()
    return data;
  } catch (error) {
    console.error("Get all sales error:", error);
    return { success: false, message: "Failed to fetch sales" };
  }
};
/* ===================== GET SALE BY ID ===================== */

export const getSaleById = async (saleId) => {
  try {
    const res = await fetch(`${SALES_BASE}/${saleId}`, {
      headers: getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Get sale by ID error:", error);
    return { success: false, message: "Failed to fetch sale details" };
  }
};

/* ===================== Get Sale by shift cashier ===================== */
export const getCashierSalesByShiftDate = async (businessDate) => {
  try {
    // Construct the URL to match /api/sales/sales-by-shift/2024-01-01
    const res = await fetch(`${SALES_BASE}/sales-by-shift/${businessDate}`, {
      headers: getAuthHeaders(),
    });

    return await res.json();
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to fetch sales",
    };
  }
};

/* ===================== CONFIRM SALE RETURN (ADMIN) ===================== */

export const confirmSaleReturn = async (saleId) => {
  try {
    const res = await fetch(`${SALES_BASE}/${saleId}/return`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Confirm return error:", error);
    return { success: false, message: "Failed to confirm return" };
  }
};

/* ===================== GET CASHIERS (ADMIN) ===================== */

export const getCashiers = async () => {
  try {
    const res = await fetch(`${USERS_BASE}?role=CASHIER`, {
      headers: getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Get cashiers error:", error);
    return { success: false, message: "Failed to fetch cashiers" };
  }
};

/* ===================== SALES SUMMARY ===================== */

export const getSalesSummary = async () => {
  try {
    const res = await fetch(`${SALES_BASE}/summary`, {
      headers: getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Sales summary error:", error);
    return { success: false, message: "Failed to load sales summary" };
  }
};

/* ===================== TODAY SALES ===================== */

export const getTodaySales = async (currentBussines_date) => {
  try {
    const res = await fetch(
      `${SALES_BASE}/sales-by-shift/${currentBussines_date}`,
      {
        headers: getAuthHeaders(),
      },
    );

    return await handleResponse(res);
  } catch (error) {
    console.error("Today sales error:", error);
    return { success: false, message: "Failed to load today sales" };
  }
};

/* ===================== SALES BY PAYMENT METHOD ===================== */

export const getSalesByPaymentMethod = async (paymentMethod) => {
  try {
    const res = await fetch(
      `${MY_SALES_BASE}?payment_method=${paymentMethod}`,
      { headers: getAuthHeaders() },
    );

    return await handleResponse(res);
  } catch (error) {
    console.error("Sales by payment error:", error);
    return {
      success: false,
      message: "Failed to fetch sales by payment method",
    };
  }
};

/* ===================== CREATING A RETURN BY CASHIER ===================== */
// utils/return.util.js

export const createReturn = async (saleId, items) => {
  const payload = { sale_id: saleId, items, requested_by: getUserId() };

  const response = await fetch(`${SALES_BASE}/return`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    // Throw the specific message from the backend
    throw new Error(
      result.message || result.error || "Failed to process return",
    );
  }
  return result;
};

// ------------------ GET ALL RETURN  (ADMIN) ------------------

export const getAllReturns = async () => {
  try {
    const response = await fetch(`${SALES_BASE}/return`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    console.log(response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch returns");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching returns:", err);
    throw err;
  }
};

// ------------------ GET RETURN BY CASHIER (CASHIER) ------------------

export const getMyReturns = async (cashierId) => {
  try {
    const response = await fetch(`${SALES_BASE}/return/${cashierId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch returns");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching returns:", err);
    throw err;
  }
};

// ------------------ APPROVE RETURN (ADMIN) ------------------// Fetch all returns

// Approve a return
export const approveReturn = async (return_id, adminId) => {
  try {
    console.log(return_id, adminId);
    const res = await fetch(`${SALES_BASE}/return/${return_id}/approve`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ approved_by: adminId }),
    });
    console.log(res);

    if (!res.ok) throw new Error("Failed to approve return");
    return await res.json();
  } catch (err) {
    console.error(`Error approving return ${id}:`, err);
    throw err;
  }
};

// Reject a return
export const rejectReturn = async (id, adminId, rejectionReason) => {
  try {
    const res = await fetch(`/api/returns/${id}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approved_by: adminId,
        rejection_reason: rejectionReason,
      }),
    });

    if (!res.ok) throw new Error("Failed to reject return");
    return await res.json();
  } catch (err) {
    console.error(`Error rejecting return ${id}:`, err);
    throw err;
  }
};
