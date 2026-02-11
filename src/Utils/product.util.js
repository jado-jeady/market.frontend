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
export async function getAllProducts() {
  
  try {
    const response = await fetch(`${API_URL}/api/products/`, {
      method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
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
        headers: getAuthHeaders
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
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers:getAuthHeaders,
      body: JSON.stringify(product),
    });

    const result = await response.json();

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