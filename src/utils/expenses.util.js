const API_URL = `${import.meta.env.VITE_API_URL}/api/expense`;

// Helper to convert object to FormData (Required for Multer/Files)
const convertToFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "receiptPreview") return; // 🚫 don't send base64 preview
    if (key === "receipt" && data[key]) {
      // If it's the file from the input

      formData.append("receipt", data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const createNewExpense = async (payload) => {
  console.log("Payload being sent:", payload);
  const body = convertToFormData(payload);
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    body,
  });
  return res.json();
};

export const updateExistingExpense = async (id, payload) => {
  const body = convertToFormData(payload);
  const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body });
  return res.json();
};

export const abortExpense = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "aborted" }),
  });
  return res.json();
};

export const fetchAllExpenses = async (params = "") => {
  const res = await fetch(`${API_URL}?${params}`);
  return res.json();
};

export const fetchExpenseById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};
