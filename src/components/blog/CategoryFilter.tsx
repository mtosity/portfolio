"use client";

import { categories, CategoryType } from "@/data/blogPosts";

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 flex-shrink-0">
      <div className="flex rounded-lg p-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex-1 px-4 py-3 text-md font-medium transition-all relative cursor-pointer ${
              selectedCategory === category
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200 border-b-2 border-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
