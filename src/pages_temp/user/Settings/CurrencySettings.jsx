import { useState } from 'react';

const CurrencySettings = () => {
  const [currency, setCurrency] = useState('USD');

  const handleSave = () => {
    alert('Currency settings saved!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Currency Settings</h1>
        <p className="text-gray-600 mt-1">Set your business currency</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="USD">USD - US Dollar ($)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="GBP">GBP - British Pound (£)</option>
            <option value="JPY">JPY - Japanese Yen (¥)</option>
            <option value="RWF">RWF - Rwandan Franc (Fr)</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition shadow-md"
        >
          Save Currency Settings
        </button>
      </div>
    </div>
  );
};

export default CurrencySettings;
