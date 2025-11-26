import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex space-x-2 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};