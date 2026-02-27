import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, foodAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  useEffect(() => {
    fetchRestaurantAndFoods();
  }, [id]);

  const fetchRestaurantAndFoods = async () => {
    try {
      const [restaurantRes, foodsRes] = await Promise.all([
        restaurantAPI.getOne(id),
        foodAPI.getAll({ restaurant: id })
      ]);
      
      setRestaurant(restaurantRes.data.data);
      setFoods(foodsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food, restaurant);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />

      {/* Restaurant Header */}
      <section className="relative h-64 w-full bg-slate-800 overflow-hidden">
        <img 
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-1 shadow-2xl overflow-hidden">
                <img 
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-lg"
                  src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-primary">star</span>
                    <span className="font-bold">{restaurant.rating}</span>
                    <span className="opacity-75">({restaurant.numberOfReviews || 0}+ Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-primary">schedule</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-primary">delivery_dining</span>
                    <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Items */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="w-1.5 h-8 bg-primary rounded-full"></span>
              Menu Items
            </h2>

            {foods.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-6xl text-slate-300 mb-4">restaurant_menu</span>
                <p className="text-slate-500">No menu items available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foods.map((food) => (
                  <FoodCard key={food._id} food={food} onAdd={handleAddToCart} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="material-icons">shopping_bag</span>
                  Your Order
                </h3>
              </div>

              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-icons text-4xl text-slate-300 mb-2">shopping_cart</span>
                    <p className="text-sm text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item._id} className="flex justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {item.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                              ₹{item.price * item.quantity}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all"
                              >
                                <span className="material-icons text-xs">remove</span>
                              </button>
                              <span className="text-sm font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all"
                              >
                                <span className="material-icons text-xs">add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Delivery Fee</span>
                        <span className={restaurant.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                          {restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
                        <span>Total</span>
                        <span className="text-primary text-xl">₹{getCartTotal() + (restaurant.deliveryFee || 0)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all mt-4"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetails;