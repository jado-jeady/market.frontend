import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <p className="mb-4 text-gray-700">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;