import { useState } from 'react';

const NewSale = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.1; // 10% tax
  };

  const handleCheckout = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/sales/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: selectedCustomer,
          items: cart,
          subtotal: calculateTotal(),
          tax: calculateTax(),
          total: calculateTotal() + calculateTax(),
          paymentMethod
        })
      });

      if (response.ok) {
        alert('Sale completed successfully!');
        setCart([]);
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error('Error processing sale:', error);
    }
  };

  // Mock products
  const mockProducts = [
    { id: 1, name: 'Product A', price: 100, stock: 50 },
    { id: 2, name: 'Product B', price: 40000, stock: 30 },
    { id: 3, name: 'Product C', price: 110, stock: 100 },
    { id: 4, name: 'Product D', price: 390, stock: 25 },
    { id: 5, name: 'Product E', price: 5980, stock: 15 },
    { id: 6, name: 'Product F', price: 2430, stock: 60 },
    { id: 7, name: 'Product G', price: 1200, stock: 45 },
    { id: 8, name: 'Product H', price: 890, stock: 20 },
    { id: 9, name: 'Product I', price: 1500, stock: 35 },
    { id: 10, name: 'Product J', price: 750, stock: 40 },
  ];

  return (
    <div className="p-6 pt-1">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">New Sale</h2>
        <p className="text-gray-600 mt-1">Create a new sales transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products by name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockProducts
              .filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 text-left border-2 border-transparent hover:border-gray-500"
                >
                  {/* prod Image */}
                  <div className="w-full h-15 bg-gradient-to-br from-gray-100 to-secondary-100 rounded-lg mb-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs font-bold text-gray-600">{product.price} frw</p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                </button>
              ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1 mt-[-1000px] lg:mt-0">
          <div className="bg-white rounded-lg shadow-md sticky top-20">
            {/* Customer Selection */}
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <select
                value={selectedCustomer || ''}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 text-gray-600 text-xs py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Walk-in Customer</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Bob Johnson</option>
              </select>
            </div>

            {/* Cart Items */}
            <div className="p-4 max-h-96 mt-0 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Cart Items ({cart.length})</h3>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-xs">{item.name}</h4>
                          <p className="text-gray-600 text-xs font-semibold">{item.price}frw</p>
                        </div>
                        
                        {/* quantity And Buttons */}
                        <div className="flex items-center space-x-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-8 text-center border text-gray-900 text-xs border-gray-300 rounded py-1 outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                        >
                          +
                        </button>
                        <span className="ml-2 font-semibold text-sm text-gray-900">
                          {item.price * item.quantity}frw
                        </span>
                      </div>
                      {/* remove item button */}
                      <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className=''><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg></span>
                        </button>

                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {cart.length > 0 && (
              <>
                <div className="p-4 border-t fixed-bottom border-gray-200 space-y-2">
                  <div className="flex justify-between fixed-bottom text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-600">{calculateTotal().toFixed(2)}frw</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-medium text-gray-600">{calculateTax().toFixed(2)}frw</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-gray-600">{(calculateTotal() + calculateTax()).toFixed(2)}frw</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-2 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'cash'
                          ? 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('momo')}
                      className={`py-2 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'momo'
                          ? 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Momo Pay
                    </button>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'card'
                          ? 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-secondary-700 transition shadow-md"
                  >
                    Complete Sale
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSale;
