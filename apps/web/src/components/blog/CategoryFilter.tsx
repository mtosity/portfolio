"use client";

import { SegmentedControl } from "@mtosity/design-system";
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
    <div style={{ flexShrink: 0, marginBottom: "0.5rem" }}>
      <SegmentedControl
        aria-label="Category"
        options={categories}
        value={selectedCategory}
        onChange={onCategoryChange}
      />
    </div>
  );
}
