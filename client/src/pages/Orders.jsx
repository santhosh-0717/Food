import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-700';
      case 'Confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'Preparing': return 'bg-primary/10 text-primary';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'Placed': return '15%';
      case 'Confirmed': return '30%';
      case 'Preparing': return '55%';
      case 'Out for Delivery': return '80%';
      case 'Delivered': return '100%';
      case 'Cancelled': return '0%';
      default: return '0%';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') {
      return !['Delivered', 'Cancelled'].includes(order.orderStatus);
    }
    if (filter === 'completed') {
      return ['Delivered', 'Cancelled'].includes(order.orderStatus);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Orders</h1>
            <p className="text-slate-500 text-sm">
              Track your current deliveries and view your dining history.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-primary/5 dark:bg-primary/10 rounded-lg">
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all capitalize ${
                  filter === tab
                    ? 'bg-white dark:bg-slate-800 shadow-sm text-primary'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
              receipt_long
            </span>
            <h3 className="text-xl font-bold text-slate-500 mb-2">No Orders Found</h3>
            <p className="text-slate-400 mb-6">
              {filter === 'active'
                ? 'No active orders right now.'
                : 'You have no order history yet.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <span className="material-icons">restaurant</span>
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                  !['Delivered', 'Cancelled'].includes(order.orderStatus)
                    ? 'border-primary/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="p-5">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          alt="Restaurant"
                          className="w-full h-full object-cover"
                          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">
                          {order.restaurant?.name || 'Restaurant'}
                        </h3>
                        <p className="text-slate-500 text-sm mt-0.5">
                          Order #{order._id.slice(-5).toUpperCase()} •{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}>
                        {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                          <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                        )}
                        {order.orderStatus}
                      </span>
                      <span className="text-lg font-bold">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Progress Bar - Active Orders Only */}
                  {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                    <div className="py-4 border-y border-slate-100 dark:border-slate-800 mb-4">
                      <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                        <span>{order.orderStatus}</span>
                        <span>Est. 30-45 mins</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: getProgressWidth(order.orderStatus) }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Order Items & Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {order.items
                        .map(item => `${item.quantity}x ${item.name}`)
                        .join(', ')}
                    </p>

                    <div className="flex gap-2">
                      {order.orderStatus === 'Delivered' && (
                        <button
                          onClick={() => navigate(`/restaurant/${order.restaurant?._id}`)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                        >
                          <span className="material-icons text-sm">refresh</span>
                          Reorder
                        </button>
                      )}

                      {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
                          <span className="material-icons text-sm">location_on</span>
                          Track Order
                        </button>
                      )}

                      {order.orderStatus === 'Cancelled' && (
                        <span className="text-sm text-slate-400 italic self-center">
                          Order was cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors">
              Load Older Orders
              <span className="material-icons">expand_more</span>
            </button>
          </div>
        )}
      </main>

      {/* Floating Support Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform">
        <span className="material-icons">chat_bubble</span>
      </button>
    </div>
  );
};

export default Orders;