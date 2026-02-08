import { useState,useEffect} from 'react';
import { getAllCategories } from '../../Utils/CategoryUtils';
import { createProduct } from '../../Utils/product.util';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    barcode: '',
    buying_price: '',
    selling_price: '',
    stock_quantity: '', //initial_stock
    //vat_category: '',
    expire_date: '',
    min_stock: '',
    description: '',
    supplier: '',
  });
  const [categories, setCategories] = useState([]);
   const [Expire_error, setExpire_errors] = useState(null);
   const [Pricing_error, setPricing_errors] = useState(null);
   const [stock_error, setStock_error] = useState(null);

  // Getting All Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      // assuming backend returns { success: true, data: [...] }
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExpire_errors(null);
    setPricing_errors(null);

    // creting a product object to send to the backend
     
      // Validation rules
    if (Number(formData.selling_price) < Number(formData.buying_price)) {
      console.log(formData.selling_price, formData.buying_price);
      setPricing_errors("Selling price must be equal to or greater than buying price.");
      return;
    }

    if (Number(formData.stock_quantity) <= 0) {
      setStock_error("Stock quantity must be greater than 0.");
      return;
    }

      // Use expire_date (matching your state key)
  const today = new Date();
  const selectedDate = new Date(formData.expire_date);
  if (selectedDate <= today) {
    setExpire_errors("Expire date must be in the future.");
    return;
  }

    // Stop submission if there are errors
    if (Expire_error || Pricing_error) return;


    try {
       const res = await createProduct(formData);
       

  if (res?.success) {
    toast.success("Product added successfully");
    setFormData({
      name: "",
      sku: "",
      category_id: "",
      barcode: "",
      buying_price: "",
      selling_price: "",
      stock_quantity: "",
      min_stock: "",
      expiry_date: "",
      description: "",
      supplier: "",
    });
  } else {
    
    toast.error(res || "Failed to hhhhh add product");
    console.error("Error response from backend:", res);
  }
    } catch (error) {
      
      toast.error("Failed to add product");
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="p-6 pt-2">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900">Create New Product</h3>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the product details below to add it on the marketplace platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">

        {/* BASIC + PRICING ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BASIC INFORMATION */}
          <div className="bg-white h-full rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product Name <span className='text-red-300'>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-gray-600 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SKU <span className='text-red-300'>*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-gray-600 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Product Stock keeping unit (SKU)"
                />
                
              </div>

              <div>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Category <span className="text-red-300">*</span>
      </label>
      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        required
        className="w-full text-gray-600 px-4 py-2 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
      >
        <option value="none">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>


              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Barcode <span className='text-red-300'>*</span>
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-600  text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Barcode"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Expire Date <span className='text-red-300'>*</span>
                </label>
                <input
                  type="date"
                  name="expire_date"
                  value={formData.expire_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-600  text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Expire Date"
                />
                {Expire_error && (
          <p className="text-red-500 text-xs mt-1">{Expire_error}</p>
        )}

              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder='Product Description...'
                  className="w-full px-4 text-gray-600 py-2 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              
            </div>
          </div>

          {/* PRICING & STOCK */}
          <div className="bg-white h-full rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Cost Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1 text-gray-500">$</span>
                  <input
                    type="number"
                    min={0}
                    name="buying_price"
                    value={formData.buying_price}
                    placeholder='Cost price...'
                    onChange={handleChange}
                    className="w-full pl-8 px-4 text-gray-600 py-2 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Selling Price <span className='text-red-300'>*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1 text-gray-500">$</span>
                  <input
                    type="number"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full pl-8 px-4 text-gray-600 py-2 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {Pricing_error && (<p className="text-red-500 text-xs mt-1">{Pricing_error}</p>)}

                </div>
              </div>

             

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Initial Stock <span className='text-red-300'>*</span>
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder='Initial stock...'
                  className="w-full px-4 py-2 text-gray-600  text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {stock_error && (<p className="text-red-500 text-xs mt-1">{stock_error}</p>)}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Minimum Stock <span className='text-red-300'>*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  name="min_stock"
                  value={formData.min_stock}
                  onChange={handleChange}
                  placeholder='Minimum stock...'
                  className="w-full px-4 py-2 text-gray-600 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              
        
        
            </div>
          {/* SUPPLIER */}
          <div className="bg-gray-100 mt-2 rounded-lg shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Supplier Information
          </h2>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-600 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Supplier name..."
          />
        </div>
          </div>
        </div>


        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            type="Reset"
            className="px-2 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-2 py-1 bg-gray-600 text-sm text-white rounded-lg hover:bg-gray-900"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
