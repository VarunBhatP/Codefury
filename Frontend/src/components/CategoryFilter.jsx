import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="flex justify-center space-x-2 sm:space-x-4 my-8">
            {categories.map(category => (
                <button 
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                        selectedCategory === category 
                        ? 'bg-orange-800 text-white shadow-lg' 
                        : 'bg-white text-orange-800 hover:bg-orange-100'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;