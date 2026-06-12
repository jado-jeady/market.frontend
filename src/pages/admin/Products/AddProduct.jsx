import react, { useState, useEffect } from "react";
import { getAllCategories } from "../../../utils/category.util";
import { createProduct } from "../../../utils/product.util";
import ProductsPreviewModal from "../../../components/ProductsComponents/ProductsPreviewModal";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category_id: "",
    barcode: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    expire_date: "",
    min_stock: "",
    description: "",
    isConsumable: false,
    isBaristaItem: false,
    supplier: "",
  });
  const [categories, setCategories] = useState([]);
  const [Expire_error, setExpire_errors] = useState(null);
  const [Pricing_error, setPricing_errors] = useState(null);
  const [stock_error, setStock_error] = useState(null);
  const [barcode_error, setBarcode_error] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const [isFileEmpty, setIsFileEmpty] = useState(false);

  const [showModalExelPreviewModel, setshowModalExelPreviewModel] =
    useState(false);

  const isBaristaItem = formData.isBaristaItem;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
  }, []);

  // Generate and download template
  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("ProductsTemplate");

    ws.columns = [
      { header: "Barcode", key: "barcode", width: 20 },
      { header: "Buying Price", key: "buying_price", width: 15 },
      { header: "Category", key: "category_name", width: 20 }, // dropdown of names
      { header: "Description", key: "description", width: 30 },
      { header: "Expire Date", key: "expire_date", width: 15 },
      { header: "Is Barista Item", key: "isBaristaItem", width: 15 },
      { header: "Is Consumable", key: "isConsumable", width: 15 },
      { header: "Min Stock", key: "min_stock", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "Selling Price", key: "selling_price", width: 15 },
      { header: "SKU", key: "sku", width: 15 },
      { header: "Stock Quantity", key: "stock_quantity", width: 15 },
      { header: "Supplier", key: "supplier", width: 20 },
    ];

    // Dropdown of category names
    for (let i = 2; i <= 100; i++) {
      ws.getCell(`C${i}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${categories.map((c) => c.name).join(",")}"`],
      };
    }

    // Hidden sheet with ID → Name mapping
    const catSheet = workbook.addWorksheet("Categories");
    catSheet.addRow(["ID", "Name"]);
    categories.forEach((c) => catSheet.addRow([c.id, c.name]));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProductsTemplate.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleCloseModal = () => {
    setshowModalExelPreviewModel(false);
    // ✅ Clear file input manually
    const fileInput = document.querySelector("#excelUploadInput");
    if (fileInput) fileInput.value = null;
  };

  // Handle upload and parse
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const rows = jsonData
        .slice(1)
        .map((row) => {
          const categoryName = row[2] || "";
          const category = categories.find((c) => c.name === categoryName);

          return {
            barcode: row[0] ? String(row[0]).trim() : "",
            buying_price: row[1] ? Number(row[1]) : null,
            category_id: category ? category.id : null,
            description: row[3] ? String(row[3]).trim() : "",
            expire_date: row[4] ? String(row[4]).trim() : "",
            isBaristaItem: String(row[5]).toLowerCase() === "true",
            isConsumable: String(row[6]).toLowerCase() === "true",
            min_stock: row[7] ? Number(row[7]) : null,
            name: row[8] ? String(row[8]).trim() : "",
            selling_price: row[9] ? Number(row[9]) : null,
            sku: row[10] ? String(row[10]).trim() : "",
            stock_quantity: row[11] ? Number(row[11]) : null,
            supplier: row[12] ? String(row[12]).trim() : "",
            category_name: categoryName,
          };
        })
        .filter(
          (row) =>
            row.barcode !== "" ||
            row.name !== "" ||
            row.sku !== "" ||
            row.category_id !== null,
        );

      // ✅ Notify user if no valid rows
      if (rows.length === 0) {
        alert(`No valid rows found in ${file.name} File`);
        handleCloseModal();
        return;
      } else {
        setExcelData(rows);
        setshowModalExelPreviewModel(true);
      }

      setExcelData(rows);
      setshowModalExelPreviewModel(true);
      e.target.value = null;
    };
    reader.readAsArrayBuffer(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear barista-only fields when switching to barista mode
    if (name === "isBaristaItem" && checked) {
      setFormData((prev) => ({
        ...prev,
        isBaristaItem: true,
        sku: "",
        buying_price: "",
        expire_date: "",
        stock_quantity: "",
        min_stock: "",
        supplier: "",
      }));
      setExpire_errors(null);
      setPricing_errors(null);
      setStock_error(null);
      return;
    }

    if (name === "selling_price" || name === "buying_price") {
      const sellingPrice =
        name === "selling_price" ? value : formData.selling_price;
      const buyingPrice =
        name === "buying_price" ? value : formData.buying_price;
      if (
        sellingPrice &&
        buyingPrice &&
        Number(sellingPrice) < Number(buyingPrice)
      ) {
        setPricing_errors(
          "Selling price must be equal to or greater than buying price.",
        );
      } else {
        setPricing_errors(null);
      }
    }

    if (name === "expire_date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      if (selectedDate <= today) {
        setExpire_errors("Expire date must be in the future.");
      } else {
        setExpire_errors(null);
      }
    }

    if (name === "stock_quantity") {
      if (value && Number(value) <= 0) {
        setStock_error("Stock quantity must be greater than 0.");
      } else {
        setStock_error(null);
      }
    }

    if (name === "barcode") {
      setBarcode_error(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExpire_errors(null);
    setPricing_errors(null);
    setStock_error(null);
    setBarcode_error(null);
    setIsLoading(true);

    let hasError = false;

    // Only validate barista-hidden fields when NOT a barista item
    if (!isBaristaItem) {
      if (Number(formData.selling_price) < Number(formData.buying_price)) {
        setPricing_errors(
          "Selling price must be equal to or greater than buying price.",
        );
        hasError = true;
      }

      if (Number(formData.stock_quantity) <= 0) {
        setStock_error("Stock quantity must be greater than 0.");
        hasError = true;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.expire_date);
      if (selectedDate <= today) {
        setExpire_errors("Expire date must be in the future.");
        hasError = true;
      }
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("payload of prodcut to send", formData);
      const res = await createProduct(formData, categories);

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
          expire_date: "",
          description: "",
          isConsumable: false,
          isBaristaItem: false,
          supplier: "",
        });
        setExpire_errors(null);
        setPricing_errors(null);
        setStock_error(null);
        setBarcode_error(null);
        setIsLoading(false);
      } else {
        console.error("Error response from backend:", res);
        if (
          res?.message?.toLowerCase().includes("barcode") ||
          res?.error?.toLowerCase().includes("barcode") ||
          res?.message?.toLowerCase().includes("already exists") ||
          res?.error?.toLowerCase().includes("duplicate")
        ) {
          setBarcode_error(
            "This barcode already exists. Please use a different barcode.",
          );
        }
        toast.error(
          <Link
            to="/admin/products"
            className="text-red-500 text-sm hover:underline"
          >
            Product with barcode{" "}
            <i className="text-red-500">{formData.barcode} </i> exists. Click
            here to adjust its stock{" "}
          </Link>,
          { autoClose: 10000 },
        );
        setIsLoading(false);
      }
    } catch (error) {
      if (
        error?.response?.data?.message?.toLowerCase().includes("barcode") ||
        error?.response?.data?.error?.toLowerCase().includes("barcode")
      ) {
        setBarcode_error(
          "This barcode already exists. Please use a different barcode.",
        );
        setIsLoading(false);
      }
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 pt-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Header */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-900">Add a new product</h3>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the product details below to add it on the marketplace
            platform.
          </p>
        </div>
        <div className="p-6 pt-2">
          {/* Excel buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs"
            >
              Download Excel Template
            </button>

            <label className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs cursor-pointer">
              Upload Excel File
              <input
                id="excelUploadInput"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            {/* Modal preview */}
            {showModalExelPreviewModel && (
              <ProductsPreviewModal
                data={excelData}
                isFileEmpty={isFileEmpty}
                onClose={() => {
                  setshowModalExelPreviewModel(false);
                  setExcelData([]);
                  handleCloseModal();
                }}
              />
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">
        {/* BASIC + PRICING ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BASIC INFORMATION */}
          <div className="bg-white h-full rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center text-xs text-gray-600 mt-1 space-x-1">
                <input
                  type="checkbox"
                  id="consumable"
                  name="isConsumable"
                  checked={formData.isConsumable}
                  onChange={handleChange}
                  className="h-3 w-3 bg-transparent appearance-white accent-blue-500 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consumable" className="cursor-pointer text-sm">
                  Consumable
                </label>
              </div>
              <div className="flex items-center text-xs text-gray-600 mt-1 space-x-1">
                <input
                  type="checkbox"
                  id="isBaristaItem"
                  name="isBaristaItem"
                  checked={formData.isBaristaItem}
                  onChange={handleChange}
                  className="h-3 w-3 bg-transparent appearance-white accent-blue-500 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isBaristaItem"
                  className="cursor-pointer text-sm"
                >
                  Barista Item
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-300">*</span>
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

              {/* SKU — hidden for barista items */}
              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-300">*</span>
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
              )}

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
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Barcode <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    required
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-gray-600 text-xs border rounded-lg ${
                      barcode_error ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-primary-500 outline-none`}
                    placeholder="Product barcode..."
                  />
                  {barcode_error && (
                    <p className="text-red-500 text-xs mt-1">{barcode_error}</p>
                  )}
                </div>
              )}

              {/* Expire Date — hidden for barista items */}
              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Expire Date <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="date"
                    name="expire_date"
                    value={formData.expire_date}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 text-gray-600 text-xs border rounded-lg ${
                      Expire_error ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-primary-500 outline-none`}
                    placeholder="Expire Date"
                  />
                  {Expire_error && (
                    <p className="text-red-500 text-xs mt-1">{Expire_error}</p>
                  )}
                </div>
              )}

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Product Description..."
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
              {/* Cost Price — hidden for barista items */}
              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Cost Price <span className="text-red-300">*</span>
                  </label>
                  <div className={showModalExelPreviewModel ? "" : "relative"}>
                    <span className="absolute left-3 top-1 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      name="buying_price"
                      value={formData.buying_price}
                      placeholder="Cost price..."
                      onChange={handleChange}
                      required
                      className={`w-full pl-8 px-4 text-gray-600 py-2 text-xs border rounded-lg ${
                        Pricing_error ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-primary-500 outline-none`}
                    />
                  </div>
                  {Pricing_error && (
                    <p className="text-red-500 text-xs mt-1">{Pricing_error}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Selling Price <span className="text-red-300">*</span>
                </label>
                <div className={showModalExelPreviewModel ? "" : "relative"}>
                  <span className="absolute left-3 top-1 text-gray-500">$</span>
                  <input
                    type="number"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    required
                    placeholder="Selling price..."
                    min={0}
                    className={`w-full pl-8 px-4 text-gray-600 py-2 text-xs border rounded-lg ${
                      Pricing_error ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-primary-500 outline-none`}
                  />
                </div>
                {Pricing_error && (
                  <p className="text-red-500 text-xs mt-1">{Pricing_error}</p>
                )}
              </div>

              {/* Initial Stock — hidden for barista items */}
              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Initial Stock <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    required
                    min={0}
                    placeholder="Initial stock..."
                    className={`w-full px-4 py-2 text-gray-600 text-xs border rounded-lg ${
                      stock_error ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-primary-500 outline-none`}
                  />
                  {stock_error && (
                    <p className="text-red-500 text-xs mt-1">{stock_error}</p>
                  )}
                </div>
              )}

              {/* Minimum Stock — hidden for barista items */}
              {!isBaristaItem && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Minimum Stock <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="min_stock"
                    value={formData.min_stock}
                    onChange={handleChange}
                    required
                    placeholder="Minimum stock..."
                    className="w-full px-4 py-2 text-gray-600 text-xs border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* SUPPLIER — hidden for barista items */}
            {!isBaristaItem && (
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
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                sku: "",
                category_id: "",
                barcode: "",
                buying_price: "",
                selling_price: "",
                stock_quantity: "",
                min_stock: "",
                expire_date: "",
                description: "",
                isConsumable: false,
                isBaristaItem: false,
                supplier: "",
              });
              setExpire_errors(null);
              setPricing_errors(null);
              setStock_error(null);
              setBarcode_error(null);
              setIsLoading(false);
            }}
            className="px-2 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-2 py-1 lg:bg-gray-700 bg:text-white sm:bg-gray-700 sm:text-white bg-gray-600 text-sm text-white rounded-lg hover:bg-gray-900"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Adding Product...</span>
              </div>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
