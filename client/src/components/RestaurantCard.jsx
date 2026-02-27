import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant._id}`}
      className="group bg-background-light dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <span className="material-icons text-primary text-sm">star</span>
          <span className="text-xs font-bold">{restaurant.rating || 4.5}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {restaurant.cuisine?.join(' • ') || 'Various Cuisines'} • {restaurant.minimumOrder ? `₹${restaurant.minimumOrder} min` : '$$$'}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="material-icons text-sm">schedule</span>
            {restaurant.deliveryTime || '25-35 min'}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="material-icons text-sm">delivery_dining</span>
            {restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;