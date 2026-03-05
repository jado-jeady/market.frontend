const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
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
export const getAllShifts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/shifts`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message || "Failed to fetch shifts" };
  }
};