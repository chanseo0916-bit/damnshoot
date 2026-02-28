"use client";

import { Heart, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Food } from "@/types/database";
import { CATEGORY_MAP } from "@/types/database";

interface FoodCardProps {
    food: Food;
    onEdit?: (food: Food) => void;
    onDelete?: (food: Food) => void;
    onToggleFavorite?: (food: Food) => void;
}

export function FoodCard({ food, onEdit, onDelete, onToggleFavorite }: FoodCardProps) {
    const cat = CATEGORY_MAP[food.category];

    return (
        <div className="food-card">
            <div className="food-card__top">
                <span className="food-card__emoji">{cat.emoji}</span>
                <div className="food-card__badges">
                    <span
                        className="ds-badge"
                        style={{ background: `${cat.color}20`, color: cat.color }}
                    >
                        {cat.label}
                    </span>
                </div>
            </div>

            <h3 className="food-card__name">{food.name}</h3>
            {food.description && (
                <p className="food-card__desc">{food.description}</p>
            )}

            <div className="food-card__actions">
                {onToggleFavorite && (
                    <button
                        onClick={() => onToggleFavorite(food)}
                        className={cn("food-card__action-btn", food.is_favorite && "food-card__action-btn--active")}
                        aria-label="즐겨찾기"
                    >
                        <Heart size={16} fill={food.is_favorite ? "currentColor" : "none"} />
                    </button>
                )}
                {onEdit && (
                    <button onClick={() => onEdit(food)} className="food-card__action-btn" aria-label="편집">
                        <Pencil size={16} />
                    </button>
                )}
                {onDelete && (
                    <button onClick={() => onDelete(food)} className="food-card__action-btn food-card__action-btn--danger" aria-label="삭제">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
