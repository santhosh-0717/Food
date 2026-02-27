import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    phone: user?.phone || '',
  });

  const deliveryFee = restaurant?.deliveryFee || 0;
  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurant._id,
        items: cart.map(item => ({
          food: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: address,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total
      };

      const response = await orderAPI.create(orderData);

      if (response.data.success) {
        clearCart();
        navigate('/orders');
        alert('🎉 Order placed successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <span className="material-icons text-8xl text-slate-300 mb-4">shopping_cart</span>
          <h2 className="text-2xl font-bold text-slate-500 mb-2">Your cart is empty!</h2>
          <p className="text-slate-400 mb-6">Add some delicious food to get started.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80 transition-opacity mb-4"
              >
                <span className="material-icons text-sm mr-1">arrow_back</span>
                Back to Menu
              </button>
              <h1 className="text-3xl font-bold">Secure Checkout</h1>
            </div>

            {/* Cart Items */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold">
                  Your Order from {restaurant?.name}
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {cart.map((item) => (
                  <div key={item._id} className="p-6 flex items-center gap-4">
                    <img
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        ₹{item.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg">
                        <button className="px-2 py-1 text-primary hover:bg-slate-50 dark:hover:bg-slate-700">
                          <span className="material-icons text-sm">remove</span>
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button className="px-2 py-1 text-primary hover:bg-slate-50 dark:hover:bg-slate-700">
                          <span className="material-icons text-sm">add</span>
                        </button>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white w-20 text-right">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <span className="material-icons text-primary">location_on</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter street address"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Zip Code
                  </label>
                  <input
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Zip Code"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Phone number"
                    type="tel"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="material-icons text-primary">account_balance_wallet</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['COD', 'Card', 'UPI'].map((method) => (
                  <label
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="material-icons text-primary mr-3">
                      {method === 'COD' ? 'payments' : method === 'Card' ? 'credit_card' : 'phone_android'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">
                        {method === 'COD' ? 'Cash on Delivery' : method === 'Card' ? 'Credit/Debit Card' : 'UPI'}
                      </p>
                    </div>
                    {paymentMethod === method && (
                      <span className="material-icons text-primary text-sm">check_circle</span>
                    )}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:w-[400px]">
            <aside className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxes & Fees (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">₹{total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <span className="material-icons">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 py-4">
                  <span className="material-icons text-sm">lock</span>
                  <span>Secure encrypted checkout</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-4">
                    <span className="material-icons text-primary">schedule</span>
                    <div>
                      <p className="text-sm font-semibold">Estimated Delivery</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {restaurant?.deliveryTime || '30-45 mins'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;