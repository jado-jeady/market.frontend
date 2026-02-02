import { useState } from 'react';

const TaxSettings = () => {
  const [taxRate, setTaxRate] = useState(10);
  const [taxEnabled, setTaxEnabled] = useState(true);

  const handleSave = () => {
    alert('Tax settings saved!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tax Settings</h1>
        <p className="text-gray-600 mt-1">Configure tax rates and rules</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Enable Tax</h3>
              <p className="text-sm text-gray-600">Apply tax to all transactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              step="0.1"
              disabled={!taxEnabled}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition shadow-md"
        >
          Save Tax Settings
        </button>
      </div>
    </div>
  );
};

export default TaxSettings;
