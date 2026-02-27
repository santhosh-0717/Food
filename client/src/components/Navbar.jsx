import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to={user?.role === 'user' ? '/home' : '/dashboard'}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-lg md:text-base">restaurant</span>
            </div>
            <span className="text-lg md:text-2xl font-bold tracking-tight text-primary">
              Gourmet<span className="text-slate-900 dark:text-white">Express</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Customer Links */}
            {user?.role === 'user' && (
              <>
                <Link className="font-medium hover:text-primary transition-colors" to="/home">
                  Restaurants
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" to="/orders">
                  My Orders
                </Link>
              </>
            )}

            {/* Owner / Admin Links */}
            {(user?.role === 'restaurant_owner' || user?.role === 'admin') && (
              <Link className="font-medium hover:text-primary transition-colors" to="/dashboard">
                Dashboard
              </Link>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-icons text-slate-600 dark:text-slate-300">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {user ? (
              <>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : user.role === 'restaurant_owner'
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {user.role === 'admin' ? '👑' : user.role === 'restaurant_owner' ? '🏪' : '👤'}
                </span>

                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Hi, {user.name.split(' ')[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="font-medium hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="font-medium hover:text-primary transition-colors">
                Login
              </Link>
            )}

            {/* Cart - Customers only */}
            {user?.role === 'user' && (
              <Link to="/checkout" className="relative cursor-pointer group">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary transition-colors">
                  <span className="material-icons text-primary group-hover:text-white">
                    shopping_cart
                  </span>
                </div>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background-light dark:border-background-dark">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Cart Icon */}
            {user?.role === 'user' && (
              <Link to="/checkout" className="relative">
                <span className="material-icons text-slate-600 dark:text-slate-300">shopping_cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-icons text-slate-600 dark:text-slate-300">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col space-y-4">
              {user?.role === 'user' && (
                <>
                  <Link 
                    to="/home" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    Restaurants
                  </Link>
                  <Link 
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                </>
              )}

              {(user?.role === 'restaurant_owner' || user?.role === 'admin') && (
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
              >
                <span className="material-icons text-sm">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-600'
                        : user.role === 'restaurant_owner'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'restaurant_owner' ? '🏪 Owner' : '👤 Customer'}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left font-medium hover:text-primary transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium hover:text-primary transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;