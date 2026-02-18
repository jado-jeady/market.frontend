import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, deleteCategory,updateCategory} from '../../../utils/category.util';



const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    description: '',
  });
  

  // Fetch categories once when component mounts
  useEffect(() => {
    getAllCategories().then((res) => {
      setCategories(Array.isArray(res?.data) ? res.data : []);
    });
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: '', description: '' });
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
      if (isEditing) {
        const updated = await updateCategory(currentCategory);
        if (updated) {
          setCategories((prev) =>
            prev.map((cat) => (cat.id === currentCategory.id ? updated : cat))
          );
          
        }
      } else {
        const created = await createCategory(currentCategory);
        if (created) {
          setCategories((prev) => [...prev, created]);
          
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error("There was an error", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
     deleteCategory(id).then((res) => {
        if (res) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          alert("Category deleted from the database");
        }
    });
  }};

  return (
    <div className="p-4 md:p-6 w-full">
      {/* HEADER */}
      <div className="flex items-center w-full justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Categories</h3>
          <p className="text-sm text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-2 text-xs py-2 bg-gray-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Category
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div className="overflow-x-auto bg-white">
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 text-gray-500 py-4">{category.id}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category Name <span className='text-red-500'> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleChange}
                  required
                  placeholder='Category name...'
                  className="w-full px-4 py-2 text-xs text-gray-500 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
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
                  placeholder='Category Description'
                  className="w-full px-4 py-2 text-xs text-gray-500 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  {isEditing ? 'Update' : 'Save'}
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