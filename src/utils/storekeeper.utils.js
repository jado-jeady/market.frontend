const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BASE_URL = import.meta.env.VITE_API_URL;

/* ===================== GET PRODUCTION LOGS ===================== */
export const getAllProductions= async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/storekeeper/productions`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    console.log(response)

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("API call failed:", error);
    return [];
  }
};

/* ===================== GET PRODUCTION LOG BY ID ===================== */
export const getProductionLogById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`, {
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("API call failed:", error);
    return null;
  }
};

/* ===================== CREATE PRODUCTION ===================== */
export const createProduction = async (productionData) => {
  try {
    console.log("Payload being sent:", productionData);

    const response = await fetch(`${BASE_URL}/api/storekeeper/production`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productionData), // must be { items: [...] }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create production");
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return { success: false, message: error.message };
  }
};

/* ===================== UPDATE PRODUCTION LOG ===================== */
export const updateProductionLog = async (id, productionLogData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(productionLogData), // FIXED
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("API call failed:", error);
    return null;
  }
};

/* ===================== DELETE PRODUCTION LOG ===================== */
export const deleteProductionLog = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.log("API call failed:", error);
    return false;
  }
};