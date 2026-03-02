const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};
const BASE_URL = import.meta.env.VITE_API_URL


export const getProductionLogs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/storekeeper/production`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log('API call failed:', error);
    return [];
  }
};

export const getProductionLogById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log('API call failed:', error);
    return null;
  }
};

export const createProduction = async (productionData) => {
  try {
    console.log("Payload being sent:", productionData);
    console.log("Headers:", getAuthHeaders());

    const response = await fetch(`${BASE_URL}/api/storekeeper/production`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productionData), // FIXED
    });

    console.log("Response object:", response);

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

export const updateProductionLog = async (id, productionLogData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productionLogData })
    });
    console.log("this is the response")
    console.log(response)
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log('API call failed:', error);
    return null;
  }
};

export const deleteProductionLog = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/production-logs/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.log('API call failed:', error);
    return false;
  }
};
