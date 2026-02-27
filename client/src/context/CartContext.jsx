import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('restaurant');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedRestaurant) setRestaurant(JSON.parse(savedRestaurant));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (restaurant) {
      localStorage.setItem('restaurant', JSON.stringify(restaurant));
    }
  }, [cart, restaurant]);

  const addToCart = (food, restaurantData) => {
    // Check if adding from different restaurant
    if (restaurant && restaurant._id !== restaurantData._id) {
      const confirmClear = window.confirm(
        `Your cart contains items from ${restaurant.name}. Do you want to clear it and add items from ${restaurantData.name}?`
      );
      
      if (!confirmClear) return;
      
      // Clear cart and add new item
      setRestaurant(restaurantData);
      setCart([{ ...food, quantity: 1 }]);
      return;
    }

    // Set restaurant if first item
    if (!restaurant) {
      setRestaurant(restaurantData);
    }

    // Check if item already in cart
    const existingItem = cart.find(item => item._id === food._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === food._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const removeFromCart = (foodId) => {
    const newCart = cart.filter(item => item._id !== foodId);
    setCart(newCart);
    
    // Clear restaurant if cart is empty
    if (newCart.length === 0) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity === 0) {
      removeFromCart(foodId);
      return;
    }
    
    setCart(cart.map(item =>
      item._id === foodId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('restaurant');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      restaurant,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};