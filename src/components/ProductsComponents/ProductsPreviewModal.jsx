import { createProduct } from "../../utils/product.util";
export default function ProductsPreviewModal({
  data,
  categories,
  isFileEmpty,
  onClose,
}) {
  const handleUploadAll = async () => {
    try {
      const res = await createProduct(data, categories);

      if (!res.ok) throw new Error("Upload failed");
      alert("Products uploaded successfully!");
      onClose();
    } catch (err) {
      alert("Error uploading products: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center">
      {isFileEmpty ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <p className="mb-4 text-gray-700">No file uploaded.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white text-gray-700 rounded-lg shadow-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Preview Products</h2>

          <table className="w-full text-xs border">
            <thead>
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className="border px-2 py-1">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-2 py-1">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadAll}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Upload All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
