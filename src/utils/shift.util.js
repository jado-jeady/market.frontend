const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const buildQueryParams = (filters) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};


const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

/* ================= GET CURRENT SHIFT ================= */
export const getCurrentShift = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/shift/current`, {
      headers: getAuthHeaders(),
    });
    console.log(res);
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to fetch current shift" };
  }
};

/* ================= OPEN SHIFT ================= */
export const openShift = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shift/open`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to open shift" };
  }
};

/* ================= CLOSE SHIFT ================= */
export const closeShift = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shift/close`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to close shift" };
  }
};

/* ================= ABORT SHIFT ================= */
export const abortShift = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shift/abort`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to abort shift" };
  }
};

/* ================= GET ALL SHIFTS (ADMIN) ================= */
export const getAllShifts = async (filters = {}) => {
  try {
    // Build query string from filters
    const params = buildQueryParams(filters); 
    const res = await fetch(`${BASE_URL}/api/shift?${params}`, {
      headers: getAuthHeaders(),
    });
    console.log("this are the params ",params);

    const data = await handleResponse(res);
    return data;
  } catch (error) {
    console.error("Get all shifts error:", error);
    return { success: false, message: error?.message || "Failed to fetch shifts" };
  }
};
/* ================= GET SHIFT BY ID (ADMIN) ================= */
export const getShiftById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shifts/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to fetch shift" };
  }
};

/* ================= CREATE SHIFT (ADMIN) ================= */
export const createShift = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shift`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to create shift" };
  }
};