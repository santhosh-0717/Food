import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    setFilteredRestaurants(restaurants);
  }, [restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data.data);
      setFilteredRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    let filtered = [...restaurants];
    
    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        r.cuisine?.some(c => c.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(r =>
        r.cuisine?.some(c => c.toLowerCase() === filters.category)
      );
    }
    
    setFilteredRestaurants(filtered);
  };

  const categories = [
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
    { name: 'Italian', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'French', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    { name: 'Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    { name: 'Salads', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' },
    { name: 'Steakhouse', img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Gourmet Dining"
            className="w-full h-full object-cover brightness-50"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gourmet dining, <br /> delivered to your doorstep.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Experience the finest cuisine from top-rated local chefs without leaving your home.
          </p>
          
          <div className="bg-white dark:bg-background-dark p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <span className="material-icons text-primary mr-2">location_on</span>
              <input 
                className="w-full border-none focus:ring-0 bg-transparent text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="Enter your delivery address..."
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2">
              <span className="material-icons text-primary mr-2">search</span>
              <input 
                className="w-full border-none focus:ring-0 bg-transparent text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="Cuisine or restaurant..."
                type="text"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg">
              Find Food
            </button>
          </div>
        </div>
      </section>

      {/* Category Slider */}
      <section className="py-12 bg-white dark:bg-background-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Explore Cuisines
            </h2>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
            {categories.map((category, index) => (
              <div key={index} className="flex-none w-32 text-center group cursor-pointer">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden">
                  <img 
                    alt={category.name}
                    className="w-16 h-16 rounded-full object-cover"
                    src={category.img}
                  />
                </div>
                <span className="font-medium group-hover:text-primary">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white dark:bg-background-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Popular Restaurants Grid */}
      <section className="py-16 bg-white dark:bg-background-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Popular Restaurants
              <span className="text-sm font-normal text-slate-500">
                ({filteredRestaurants.length} found)
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons text-6xl text-slate-300 mb-4 block">restaurant</span>
              <p className="text-slate-500 mb-4">No restaurants found matching your filters.</p>
              <button 
                onClick={() => setFilteredRestaurants(restaurants)}
                className="text-primary hover:underline font-semibold"
              >
                Clear filters and show all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;