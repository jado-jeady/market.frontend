import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../../utils/category.util";
import { toast } from "react-toastify";
import { Loader2, RefreshCcw } from "lucide-react";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      const data = Array.isArray(res?.data) ? res.data : [];
      setCategories(data);
      setFilteredCategories(data);
      toast.info("Refreshed", {
        autoClose: 300,
        hideProgressBar: true,
        toastId: "freshed",
        position: "top-center",
        size: "sm",
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm, categories]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        const updated = await updateCategory(currentCategory);
        if (updated) {
          setCategories((prev) =>
            prev.map((cat) => (cat.id === currentCategory.id ? updated : cat)),
          );
          toast.success(`Category ${updated?.name} updated`);
        }
      } else {
        const created = await createCategory(currentCategory);
        if (created) {
          setCategories((prev) => [...prev, created]);
          toast.success(`Category ${created.name} created!`);
        }
      }
      setShowModal(false);
      setCurrentCategory({ id: null, name: "", description: "" });
    } catch (err) {
      console.error("There was an error", err);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await deleteCategory(id);
        if (res) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          toast.success("Category deleted");
        }
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* HEADER */}
      <div className="flex items-center w-full justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Product Categories
          </h3>
          <p className="text-sm text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-2 text-xs py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          + Add Category
        </button>
      </div>

      {/* SEARCH + REFRESH */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by category name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 text-xs border rounded-lg w-1/3  text-gray-600 border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={fetchCategories}
          className="ml-2 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* CATEGORY LIST */}

      {/* TABLE for desktop */}
      <div className="hidden md:block overflow-x-auto bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Description</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 text-gray-500 py-4">{category.id}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-gray-500">
                  No categories available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS for mobile */}
      <div className="block md:hidden space-y-3 grid grid-cols-3 gap-4 ">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="p-3 border rounded-lg shadow-sm bg-white flex flex-col justify-between"
            >
              <div className="text-sm font-semibold text-gray-800">
                {category.name}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {category.description}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-blue-600 text-xs text-right bg-gray-100 px-2 py-1 rounded hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 text-xs text-right bg-gray-100 px-2 py-1 rounded hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xs py-4">
            No categories available
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">
              {isEditing ? "Edit Category" : "Add a New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleChange}
                  required
                  placeholder="Category name..."
                  className="w-full px-4 py-2 text-xs text-gray-500 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={currentCategory.description}
                  onChange={handleChange}
                  placeholder="Category Description"
                  className="w-full px-4 py-2 text-xs text-gray-500 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 text-xs font-semibold bg-white border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-gray-600 border border-gray-600 text-white rounded-lg hover:bg-gray-700 hover:border-gray-700 focus:ring-2 focus:ring-gray-500"
                >
                  {isEditing
                    ? loading
                      ? "Updating..."
                      : "Update"
                    : loading
                      ? "Adding..."
                      : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
