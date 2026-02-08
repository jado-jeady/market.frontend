const API_URL = import.meta.env.VITE_API_URL; 
const authData = JSON.parse(localStorage.getItem("user"));
const token = authData?.data?.token;


export async function getAllCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("There was an error fetching the data", err);
        return null;
    }
}


// creating the Category


export async function createCategory(category) {
  try {
    // Parse the stored login object
console.log("Creating category with token:", token);
    const response = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: category.name,
        description: category.description
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error creating category:", result);
      throw new Error(result.message || response.statusText);
    }

    return result.data; // backend should return { success: true, data: {...} }
  } catch (err) {
    console.error("There was an error creating the category", err);
    return null;
  }
}

// Deleting the category

export async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("There was an error deleting the category", err);
        return null;
    }
}

// update category can be implemented similarly with a PUT or PATCH request to the API, depending on how the backend is set up.

export async function updateCategory(category) {
  try {
    const response = await fetch(`${API_URL}/api/categories/${category.id}`, {
        method: 'PUT', // or 'PATCH' based on your API design
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: category.name,
            description: category.description
        }),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || response.statusText);
    }
    return result.data;
  } catch (err) {
    console.error("There was an error updating the category", err);
    return null;
  }
}  

// get category by ID 
// categoriesUtils.js

export async function getCategoryById(id) {
  try {
    // getAllCategories returns the full backend response object
    const res = await getAllCategories();

    // Depending on your backend, categories are inside res.data
    const categoryList = res?.data;

    console.log("Category list:", categoryList);

    if (!Array.isArray(categoryList)) {
      console.error("Categories must be an array");
      return null;
    }

    return categoryList.find(cat => cat.id === id) || null;
  } catch (err) {
    console.error("Error fetching category by id:", err);
    return null;
  }
}