import * as XLSX from "xlsx";
const API_URL = import.meta.env.VITE_API_URL;
// Get token safely
const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const buildQueryParams = (filters = {}) =>
  new URLSearchParams(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  ).toString();

/* ============================
   CREATE PRODUCT
============================ */
export async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}/api/products/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });

    const result = await response.json();

    if (!response.ok) {
      return result.message || "Failed to create product";
    }
    return result; // { success, data }
  } catch (err) {
    console.error("Error creating product:", err);
    return null;
  }
}

/* ============================
   GET ALL PRODUCTS
============================ */

export async function getAllProducts(filters = {}) {
  try {
    const params = buildQueryParams(filters);

    // Add the "?" only if params isn't an empty string
    const queryString = params ? `?${params}` : "";

    const response = await fetch(`${API_URL}/api/products${queryString}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Improved: Log the status code to help debugging
      console.log(response);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return null;
  }
}

/* ============================
   GET PRODUCT BY ID
============================ */
export async function getProductById(id) {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

/* ============================
   GET PRODUCT BY BARCODE (POS)
============================ */
export async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(`${API_URL}/api/products/barcode/${barcode}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching product by barcode:", err);
    return null;
  }
}

/* ============================
   UPDATE PRODUCT
============================ */
export async function updateProduct(id, product) {
  try {
    console.log(product);
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });

    const result = await response.json();

    console.log(" results", result);
    if (!response.success) {
      return result || `Failed to update product: ${response.status}`;
    }
    return result;
  } catch (err) {
    console.error("Error updating product:", err);
    return null;
  }
}

/* ============================
   DELETE PRODUCT
============================ */
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return await response.json();
  } catch (err) {
    console.error("Error deleting product:", err);
    return null;
  }
}

// STOCK UTILITIES

export async function adjustStock(product) {
  try {
    const response = await fetch(`${API_URL}/api/stock/adjust`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    console.log("Stock adjusted successfully:", response);
    return await response;
  } catch (err) {
    console.error("Error adjusting stock:", err);
    return null;
  }
}

/**
 * Fetches all stock adjustment history records
 * @returns {Promise<Array>} List of adjustments or empty array on error
 */
export async function getStockAdjustments() {
  try {
    const response = await fetch(`${API_URL}/api/stock/adjustments`, {
      method: "GET",
      headers: getAuthHeaders(), // Assumes this helper exists in your file
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const result = await response.json();

    // Standardize return: ensure it returns an array even if backend wraps it in { data: [...] }
    return Array.isArray(result) ? result : result?.data || [];
  } catch (err) {
    console.error("Error fetching stock adjustments:", err);
    return []; // Return empty array so the UI .filter() doesn't crash
  }
}

export const exportProductsToExcel = async () => {
  try {
    const res = await getAllProducts({ limit: 1000000 });

    if (!res?.success) {
      throw new Error("Failed to fetch products");
    }

    const products = res.data || [];

    const data = products.map((p) => ({
      Name: p.name,
      Barcode: p.barcode || "N/A",
      SKU: p.sku || "N/A",
      Category: p.category?.name || "N/A",
      Price: Number(p.selling_price || 0),
      Stock: p.stock_quantity,
      MinStock: p.min_stock,
      Status:
        p.stock_quantity === 0
          ? "Out of Stock"
          : p.stock_quantity <= p.min_stock
            ? "Low Stock"
            : "In Stock",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  } catch (error) {
    console.error(error);
  }
};

export const getAllConsumables = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products/consumables`, {
      method: "GET",
      Authorization: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    const consumables = await response.json();
    return consumables;
  } catch (error) {
    console.log(error);
  }
};

export const getLowStockItems = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products/lowstock`, {
      method: "GET",
      Authorization: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new error(errorData.message || `error:${response.status}`);
    }
    const lowstockItems = response.json();
    return lowstockItems;
  } catch (error) {
    console.log(`error Fetching the lowstockItems : ${error}`);
  }
};
