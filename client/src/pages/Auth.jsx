import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // ← Start with Login
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message);
        }
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          }
        };

        const isRestaurantOwner = role === 'restaurant_owner';
        const result = await register(userData, isRestaurantOwner);

        if (result.success) {
          navigate('/');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Visual Hero - Hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden flex-shrink-0"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 22, 16, 0.5), rgba(34, 22, 16, 0.7)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 max-w-lg text-white">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <span className="material-icons text-primary text-sm">stars</span>
            <span className="text-sm font-medium tracking-wide uppercase">
              Award Winning Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Taste the{' '}
            <span className="text-primary">Excellence</span>{' '}
            in Every Order.
          </h1>

          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Join thousands of food enthusiasts and restaurant managers who trust
            our platform for the ultimate dining experience.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-white/70 mt-1">Top Restaurants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-white/70 mt-1">Active Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100k+</div>
              <div className="text-sm text-white/70 mt-1">Happy Users</div>
            </div>
          </div>
        </div>

        {/* Decorative blur */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white dark:bg-[#2A1D16] overflow-y-auto">
        <div className="w-full max-w-md px-8 py-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">restaurant_menu</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Gourmet<span className="text-primary">Hub</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isLogin
                ? 'Please enter your details to continue.'
                : 'Join us and start ordering!'}
            </p>
          </div>

          {/* Toggle Login / Sign Up */}
          <div className="flex p-1 bg-gray-100 dark:bg-primary/10 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                isLogin
                  ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <span className="material-icons text-sm">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── SIGN UP ONLY FIELDS ── */}
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    I want to:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-center ${
                        role === 'user'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className="material-icons block mx-auto mb-1 text-xl">person</span>
                      Order Food
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('restaurant_owner')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-center ${
                        role === 'restaurant_owner'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className="material-icons block mx-auto mb-1 text-xl">store</span>
                      Own a Restaurant
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 text-xl">person_outline</span>
                    </span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                      placeholder="Your full name"
                      type="text"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 text-xl">phone</span>
                    </span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                      placeholder="Your phone number"
                      type="tel"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                      placeholder="City"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                      placeholder="State"
                      type="text"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── SHARED FIELDS ── */}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-xl">mail_outline</span>
                </span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                  placeholder="name@example.com"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-xl">lock_outline</span>
                </span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 dark:text-white placeholder-gray-400 text-sm"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="material-icons text-gray-400 hover:text-primary transition-colors">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me (Login only) */}
            {isLogin && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me for 30 days
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Switch between login/register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-semibold text-primary hover:underline"
              >
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
              <span className="material-icons text-xs">verified_user</span>
              <span>Secure AES-256 encryption enabled</span>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              <button type="button" className="text-xs text-gray-400 hover:text-primary">Privacy Policy</button>
              <button type="button" className="text-xs text-gray-400 hover:text-primary">Terms of Service</button>
              <button type="button" className="text-xs text-gray-400 hover:text-primary">Help Center</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;