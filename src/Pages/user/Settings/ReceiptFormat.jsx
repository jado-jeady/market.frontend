import { useState } from 'react';

const ReceiptFormat = () => {
  const [settings, setSettings] = useState({
    shopName: 'My Store',
    address: '123 Main St',
    phone: '+1 555-0000',
    showLogo: true,
    showTax: true,
    footerText: 'Thank you for your business!'
  });

  const handleSave = () => {
    alert('Receipt format saved!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Receipt Format</h2>
        <p className="text-gray-600 text-xs mt-1">Customize your receipt template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="space-y-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Business Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                  className="w-full px-4 text-xs py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full px-4 py-2 text-xs text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-2 text-gray-500  text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Footer Text</label>
                <textarea
                  value={settings.footerText}
                  onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                  rows="2"
                  className="w-full text-gray-500 px-4 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gray-600 text-gray-500  to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition shadow-md"
          >
            Save Receipt Format
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Receipt Preview</h3>
          <div className="border-2 border-dashed border-gray-300 rounded p-6 font-mono text-sm">
            <div className="text-center mb-4">
              <div className="text-lg text-gray-500 font-bold">{settings.shopName}</div>
              <div className="text-xs text-gray-500">{settings.address}</div>
              <div className="text-xs text-gray-500">{settings.phone}</div>
            </div>
            <div className="border-t border-gray-300 pt-2 mb-2">
              <div className="text-xs text-gray-500">Date: 2024-01-30 14:30</div>
              <div className="text-xs text-gray-500">Receipt #: 12345</div>
            </div>
            <div className="border-t border-gray-300 py-2">
              <div className="flex text-gray-500 justify-between mb-1">
                <span>Product 1</span>
                <span>$10.00</span>
              </div>
              <div className="flex text-gray-500 justify-between mb-1">
                <span>Product 2</span>
                <span>$15.00</span>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex text-gray-500 justify-between">
                <span>Subtotal:</span>
                <span>$25.00</span>
              </div>
              <div className="flex text-gray-500justify-between">
                <span>Tax:</span>
                <span>$2.50</span>
              </div>
              <div className="flex text-gray-500 justify-between font-bold">
                <span>Total:</span>
                <span>$27.50</span>
              </div>
            </div>
            <div className="border-t text-gray-500 border-gray-300 mt-4 pt-4 text-center text-xs">
              {settings.footerText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptFormat;
