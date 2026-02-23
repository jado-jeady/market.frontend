const BASE_URL = import.meta.env.VITE_API_URL;
const SHIFT_BASE = `${BASE_URL}/api/shift`;

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

/* GET ACTIVE SHIFT */
export const getActiveShift = async () => {
  try {
    const res = await fetch(`${SHIFT_BASE}/current`, {
      headers: getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch {
    return { success: false };
  }
};

/* OPEN SHIFT */
export const openShift = async (payload) => {
  try {
    const res = await fetch(`${SHIFT_BASE}/open`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message };
  }
};

/* CLOSE SHIFT */
export const closeShift = async (payload) => {
  try {
    const res = await fetch(`${SHIFT_BASE}/close`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (error) {
    return { success: false, message: error?.message };
  }
};

export const getAllShifts = async () => {
  try {
    console.log(getAuthHeaders())
    const res = await fetch(`${BASE_URL}/api/shift`, {
      headers: getAuthHeaders(),
    });


    return await handleResponse(res);
  } catch (error) {
    return { success: false,message:error};
  }
};