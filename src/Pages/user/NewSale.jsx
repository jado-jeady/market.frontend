import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProducts } from '../../Utils/product.util';

const NewSale = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  const MOCK_CUSTOMERS = [
  { id: 1, name: 'John Doe', phone: '0788123456' },
  { id: 2, name: 'Alice Mukamana', phone: '0722334455' },
  { id: 3, name: 'Eric Niyonzima', phone: '0799887766' },
  { id: 4, name: 'Jean Claude', phone: '0788990011' },
  { id: 5, name: 'Marie Josée', phone: '0733445566' },
  { id: 6, name: 'Pauline Uwase', phone: '0744556677' },
  { id: 7, name: 'Sylvie Niyonkuru', phone: '0755667788' },
  { id: 8, name: 'kalisa Mbabazi', phone: '0788123456' },
  { id: 9, name: 'kanuma Mukamana', phone: '0722334455' },
  { id: 10, name: 'muteteri Niyonzima', phone: '0799887766' },
  { id: 11, name: 'Jean Harindintwari', phone: '0788990011' },
  { id: 12, name: 'Marie rose', phone: '0733445566' },
  { id: 13, name: 'delice Uwase', phone: '0744556677' },
  { id: 14, name: 'dancira Niyonkuru', phone: '0755667788' },
  { id: 15, name: 'valery Doe', phone: '0788123456' },
  { id: 16, name: 'dancilla Mukamana', phone: '0722334455' },
  { id: 17, name: 'Charie mama bid', phone: '0799887766' },
  { id: 18, name: 'Jean Krregeya', phone: '0788990011' },
  { id: 19, name: 'Marie Harimn', phone: '0733445566' },
  { id: 20, name: ' Customer', phone: '0744556677' },
  { id: 21, name: 'Sinzi Niyonkuru', phone: '0755667788' },
];



  /* ===================== FETCH PRODUCTS ===================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res?.success) {
          setProducts(res.data);
        } else {
          toast.error('Failed to load products');
        }
      } catch (err) {
        toast.error('Error loading products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
  if (!customerQuery.trim()) {
    setCustomerSuggestions([]);
    return;
  }

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(customerQuery.toLowerCase())
  );

  setCustomerSuggestions(filtered);
}, [customerQuery]);


  /* ===================== CART LOGIC ===================== */
  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      toast.warning('Product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        toast.warning('Not enough stock available');
        return;
      }

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
      return;
    }

    const product = cart.find(item => item.id === id);
    if (quantity > product.stock_quantity) {
      toast.warning('Stock limit reached');
      return;
    }

    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  /* ===================== TOTALS ===================== */
  const calculateTotal = () =>
    cart.reduce((total, item) => total + (item.selling_price * item.quantity), 0);

  const calculateTax = () => calculateTotal() * 0.1;

  /* ===================== CHECKOUT ===================== */
 const handleCheckout = async () => {
  if (cart.length === 0) {
    toast.warning('Cart is empty');
    return;
  }

  const payload = {
    customer_id: selectedCustomer?.id || null,
    customer_name: customerQuery || 'Walk-in',
    payment_method: paymentMethod,
    items: cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.selling_price
    }))
  };
  console.log('Checkout payload:', payload);

  try {
    const token = JSON.parse(localStorage.getItem('user'))?.data?.token;

    const res = await fetch(import.meta.env.VITE_API_URL + '/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Sale failed');
    }

    toast.success('Sale completed successfully');
    setCart([]);
    setCustomerQuery('');
    setSelectedCustomer(null);
    setPaymentMethod('cash');
  } catch (error) {
    toast.error(error.message || 'Error processing sale');
  }
};


  /* ===================== FILTERED PRODUCTS ===================== */
  const filteredProducts = products.filter(product =>
    `${product.name} ${product.barcode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 pt-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* ================= PRODUCTS SECTION ================= */}
        <div className="mt-2 col-span-2 p-2">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900">New Sale</h3>
            <p className="text-gray-600 text-xs mt-1">
              Create a new sales transaction
            </p>
          </div>

          {/* SEARCH */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products by name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-2/3 h-7 px-4 py-3 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              autoFocus
            />
          </div>

          {/* PRODUCTS GRID */}
          {loadingProducts ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className={`bg-white rounded-lg shadow-md transition p-4 text-left border-2
                    ${product.stock_quantity === 0
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:shadow-lg hover:border-gray-500'
                    }`}
                >
                  <div className="w-full h-15 bg-gradient-to-br from-gray-100 to-secondary-100 rounded-lg mb-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>

                  <h3 className="font-semibold text-xs text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-600">
                    {product.selling_price} frw
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Stock: {product.stock_quantity}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= CART SECTION ================= */}
        <div className="lg:col-span-1 fixed-right mt-[-100px] lg:mt-0">
          <div className="bg-white rounded-lg shadow-md sticky top-20">

            {/* CART ITEMS */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-xs text-gray-900 mb-3">
                Cart Items ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Cart is empty</p>
              ) : (
                <div className="space-y-1">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-500 grid-cols-3 rounded-lg flex justify-between items-center p-2">
                      <div>
                        <h4 className="text-xs font-semibold">{item.name}</h4>
                        <p className="text-[0.625rem]">{item.selling_price} frw</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 text-gray-700 bg-white border rounded text-xs"
                        >-</button>

                        <input
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-8 text-center text-xs border rounded"
                        />

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 bg-white text-gray-700 border rounded text-xs"
                        >+</button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{item.selling_price * item.quantity} frw</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* CUSTOMER */}
<div className="p-2 border-t border-gray-200">
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Customer
  </label>

  <input
    type="text"
    placeholder="Type customer name..."
    value={customerQuery}
    onChange={(e) => {
      setCustomerQuery(e.target.value);
      setSelectedCustomer(null);
    }}
    className="w-full px-3 py-2 text-xs text-gray-600 border rounded-lg focus:outline-none"
  />

  {customerSuggestions.length > 0 && (
    <div className="border mt-1 rounded bg-gray-300 max-h-32 overflow-y-auto">
      {customerSuggestions.map(c => (
        <div
          key={c.id}
          onClick={() => {
            setSelectedCustomer(c);
            setCustomerQuery(c.name);
            setCustomerSuggestions([]);
          }}
          className="px-3 py-2 text-xs hover:bg-gray-100 text-gray-500 cursor-pointer"
        >
          {c.name} — {c.phone}
        </div>
      ))}
    </div>
  )}
</div>

                  


                    {/* Payment Method */}
                <div className="p-2 border-t border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-1 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'cash'
                          ? 'border-gray-500 bg-red-300 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('momo')}
                      className={`py-2 px-3 text-xs text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'momo'
                          ? 'border-gray-500 bg-yellow-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Momo Pay
                    </button>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 text-xs text-white-300 text-gray-700 rounded-lg border-2 transition ${
                        paymentMethod === 'card'
                          ? 'border-gray-500 text-white bg-red-300 text-gray-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>

                </div>
              )}
              
            </div>
            

            {/* TOTALS */}
            
            {cart.length > 0 && (
              <>
                <div className="p-4 border-t text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{calculateTotal()} frw</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>{calculateTax()} frw</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{calculateTotal() + calculateTax()} frw</span>
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold"
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
