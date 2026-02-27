import { useState } from 'react';

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');

  const categories = [
    'All', 'Italian', 'Indian', 'Chinese', 'Fast Food', 
    'Pizza', 'Burgers', 'Desserts', 'Healthy'
  ];

  const handleSearch = () => {
    onSearch({
      searchTerm,
      category: selectedCategory,
      priceRange,
      rating
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Search
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-slate-400">search</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search restaurants or food..."
              className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary"
          >
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Prices</option>
            <option value="budget">$ Budget Friendly</option>
            <option value="moderate">$$ Moderate</option>
            <option value="premium">$$$ Premium</option>
          </select>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
          ⚡ Fast Delivery
        </button>
        <button className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
          🌱 Vegetarian
        </button>
        <button className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
          🎉 Offers Available
        </button>
        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
          ⭐ Top Rated
        </button>
      </div>

      {/* Search Button */}
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setPriceRange('all');
            setRating('all');
            onSearch({ searchTerm: '', category: 'all', priceRange: 'all', rating: 'all' });
          }} 
          className="ml-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchBar;