


const ProductTransfer = () => {
    

  return (
    <div className="bg-white text-gray-700 rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-600">No Transfers Made Yet</h2>
        <p className="text-sm text-gray-500 mt-2">Start by creating your first product transfer</p>
      </div>
    </div>
  );
};

export default ProductTransfer;

