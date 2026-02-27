import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Auth from './pages/Auth';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import CreateRestaurant from './pages/CreateRestaurant';
import AddFoodItem from './pages/AddFoodItem';
import EditRestaurant from './pages/EditRestaurant';


// Smart redirect based on role
const RoleRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth" replace />;
  
  if (user.role === 'restaurant_owner' || user.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/home" replace />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-white text-3xl">restaurant</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-500 mt-4 font-medium">Loading GourmetExpress...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root → smart redirect based on role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Auth page → if logged in, smart redirect */}
      <Route
        path="/auth"
        element={!user ? <Auth /> : <RoleRedirect />}
      />

      {/* Customer Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:id"
        element={
          <ProtectedRoute>
            <RestaurantDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute adminOnly={true}>
      <Dashboard />
    </ProtectedRoute>
  }
  
/>
<Route
  path="/create-restaurant"
  element={
    <ProtectedRoute adminOnly={true}>
      <CreateRestaurant />
    </ProtectedRoute>
  }
/>
{/* Add Food Item Route */}
<Route
  path="/add-food"
  element={
    <ProtectedRoute adminOnly={true}>
      <AddFoodItem />
    </ProtectedRoute>
  }
/>

{/* Edit Restaurant Route */}
<Route
  path="/edit-restaurant/:id"
  element={
    <ProtectedRoute adminOnly={true}>
      <EditRestaurant />
    </ProtectedRoute>
  }
/>


      {/* Catch all */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

export default App;