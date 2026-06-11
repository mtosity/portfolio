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
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid var(--border)",
        marginBottom: "0",
        flexShrink: 0,
      }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className="link-hover"
            style={{
              padding: "0.6rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom: isActive
                ? "2px solid var(--fg)"
                : "2px solid transparent",
              marginBottom: "-1px",
              // Inline color pins the active tab; inactive tabs fall through
              // to .link-hover (muted, fg on hover).
              color: isActive ? "var(--fg)" : undefined,
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
