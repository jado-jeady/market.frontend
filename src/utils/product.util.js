//import * as XLSX from 'xlsx';
const API_URL = import.meta.env.VITE_API_URL;


// Get token safely
const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};


const buildQueryParams = (filters = {}) =>
  new URLSearchParams(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== ''
    )
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

/*
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

*/ 
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
      console.log(response)
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
    const response = await fetch(
      `${API_URL}/api/products/barcode/${barcode}`,
      {
        method: "GET",
        headers: getAuthHeaders()
      }
    );

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
    console.log(product)
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers:getAuthHeaders(),
      body: JSON.stringify(product),
    });

    const result = await response.json();
  console.log(result)
    if (!response.ok) {
      throw new Error(result.message || "Failed to update product");
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
      headers:getAuthHeaders
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
      body: JSON.stringify(product)
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


// export to excel 

// export const exportToExcel = (data, fileName = 'Sales_Report') => {
//   // 1. Create a new workbook and worksheet
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
  
//   // 2. Append the worksheet to the workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

//   // 3. Generate buffer and trigger download
//   XLSX.writeFile(workbook, `${fileName}.xlsx`);
// };
