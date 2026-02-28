"use client";

import { cn } from "@/lib/utils";
import type { FoodCategory } from "@/types/database";
import { CATEGORY_MAP } from "@/types/database";

interface CategoryFilterProps {
    selected: FoodCategory | null;
    onChange: (category: FoodCategory | null) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
    const categories = Object.entries(CATEGORY_MAP) as [FoodCategory, typeof CATEGORY_MAP[FoodCategory]][];

    return (
        <div className="category-filter">
            <button
                className={cn("category-filter__item", !selected && "category-filter__item--active")}
                onClick={() => onChange(null)}
            >
                전체
            </button>
            {categories.map(([key, meta]) => (
                <button
                    key={key}
                    className={cn(
                        "category-filter__item",
                        selected === key && "category-filter__item--active"
                    )}
                    onClick={() => onChange(selected === key ? null : key)}
                    style={
                        selected === key
                            ? { borderColor: meta.color, background: `${meta.color}15`, color: meta.color }
                            : undefined
                    }
                >
                    {meta.emoji} {meta.label}
                </button>
            ))}
        </div>
    );
}
