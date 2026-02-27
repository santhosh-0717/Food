const FoodCard = ({ food, onAdd }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {food.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {food.description}
          </p>
          {food.isVeg !== undefined && (
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                food.isVeg 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {food.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
          )}
        </div>
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img  
            alt={food.name}
            className="w-full h-full object-cover"
            src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-primary">₹{food.price}</span>
        <button 
          onClick={() => onAdd(food)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
        >
          <span className="material-icons text-sm">add</span> Add
        </button>
      </div>
    </div>
  );
};

export default FoodCard;