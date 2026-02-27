import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI, restaurantAPI, foodAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(orders);
    }
  }, [orders]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === 'admin') {
        // Admin: Fetch all data
        const [ordersRes, restaurantsRes] = await Promise.all([
          orderAPI.getMyOrders(),
          restaurantAPI.getAll()
        ]);
        setOrders(ordersRes.data.data);
        setRestaurants(restaurantsRes.data.data);
      } else if (user.role === 'restaurant_owner') {
        // Owner: Fetch own restaurant data
        const myRestaurantsRes = await restaurantAPI.getMyRestaurants();
        const restaurant = myRestaurantsRes.data.data[0];
        
        if (restaurant) {
          setMyRestaurant(restaurant);
          
          const [ordersRes, foodsRes] = await Promise.all([
            orderAPI.getRestaurantOrders(restaurant._id),
            foodAPI.getAll({ restaurant: restaurant._id })
          ]);
          
          setOrders(ordersRes.data.data);
          setFoods(foodsRes.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const today = new Date().toDateString();
    const todayOrders = ordersList.filter(
      order => new Date(order.createdAt).toDateString() === today
    );

    setStats({
      totalOrders: ordersList.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: ordersList.filter(o => 
        !['Delivered', 'Cancelled'].includes(o.orderStatus)
      ).length,
      completedOrders: ordersList.filter(o => o.orderStatus === 'Delivered').length
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchDashboardData();
      alert('✅ Order status updated successfully!');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await foodAPI.delete(foodId);
      fetchDashboardData();
      alert('✅ Item deleted successfully!');
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Confirmed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.role === 'admin' ? '👑 Admin Dashboard' : '🏪 Restaurant Dashboard'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {user.role === 'admin' 
                  ? 'Manage all restaurants and orders'
                  : `Managing ${myRestaurant?.name || 'your restaurant'}`
                }
              </p>
            </div>
            {user.role === 'restaurant_owner' && !myRestaurant && (
              <button
                onClick={() => navigate('/create-restaurant')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="material-icons text-sm">add</span>
                Create Restaurant
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="material-icons text-blue-600 dark:text-blue-400">receipt_long</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Today's Revenue</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  ₹{stats.todayRevenue}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="material-icons text-green-600 dark:text-green-400">payments</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <span className="material-icons text-orange-600 dark:text-orange-400">hourglass_empty</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="material-icons text-purple-600 dark:text-purple-400">check_circle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === 'orders'
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-icons text-sm">receipt</span>
                  Orders
                  {stats.pendingOrders > 0 && (
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {stats.pendingOrders}
                    </span>
                  )}
                </span>
                {activeTab === 'orders' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>

              {user.role === 'restaurant_owner' && myRestaurant && (
                <>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                      activeTab === 'menu'
                        ? 'text-primary bg-primary/5'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-icons text-sm">restaurant_menu</span>
                      My Menu
                    </span>
                    {activeTab === 'menu' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('restaurant')}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                      activeTab === 'restaurant'
                        ? 'text-primary bg-primary/5'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-icons text-sm">store</span>
                      My Restaurant
                    </span>
                    {activeTab === 'restaurant' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>
                </>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('restaurants')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                    activeTab === 'restaurants'
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">store</span>
                    All Restaurants
                  </span>
                  {activeTab === 'restaurants' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Orders
                  </h2>
                  <div className="flex gap-2">
                    <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                      receipt_long
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Order ID</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Customer</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Items</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4">
                              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-sm text-slate-900 dark:text-white">
                                  {order.user?.name || 'Customer'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {order.deliveryAddress?.city}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-primary">₹{order.total}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 dark:text-white"
                                >
                                  <option value="Placed">Placed</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Preparing">Preparing</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Menu Tab (Restaurant Owner Only) */}
            {activeTab === 'menu' && user.role === 'restaurant_owner' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Menu Items
                  </h2>
                  <button 
                    onClick={() => navigate('/add-food')}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <span className="material-icons text-sm">add</span>
                    Add Item
                  </button>
                </div>

                {foods.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                      restaurant_menu
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No menu items yet</p>
                    <button 
                      onClick={() => navigate('/add-food')}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold"
                    >
                      Add Your First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foods.map((food) => (
                      <div key={food._id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-3">
                          <img
                            src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                            alt={food.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{food.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {food.description}
                            </p>
                            <p className="text-primary font-bold mt-2">₹{food.price}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button className="flex-1 text-sm px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteFood(food._id)}
                            className="flex-1 text-sm px-3 py-1.5 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Restaurant Tab (Restaurant Owner Only) */}
            {activeTab === 'restaurant' && user.role === 'restaurant_owner' && myRestaurant && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Restaurant Details
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={myRestaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                      alt={myRestaurant.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {myRestaurant.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {myRestaurant.cuisine?.join(', ')}
                      </p>
                      <div className="flex gap-4 mt-3">
                        <span className="text-sm">⭐ {myRestaurant.rating || 4.5}</span>
                        <span className="text-sm">🕒 {myRestaurant.deliveryTime}</span>
                        <span className="text-sm">🚚 ₹{myRestaurant.deliveryFee}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/edit-restaurant/${myRestaurant._id}`)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Minimum Order
                      </label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        ₹{myRestaurant.minimumOrder || 0}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Restaurants Tab (Admin Only) */}
            {activeTab === 'restaurants' && user.role === 'admin' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    All Restaurants ({restaurants.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {restaurant.cuisine?.join(', ')}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-sm">
                          <span>⭐ {restaurant.rating || 4.5}</span>
                          <span>🕒 {restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button className="flex-1 text-sm px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;