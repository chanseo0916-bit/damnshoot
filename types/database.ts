// ========================================
// Damnshoot - Database Types
// ========================================

export type FoodCategory =
    | "korean"
    | "chinese"
    | "japanese"
    | "western"
    | "fastfood"
    | "dessert";

export type SelectionMethod =
    | "random"
    | "spinwheel"
    | "dice"
    | "filter"
    | "lottery"
    | "balance"
    | "grid_mandalart";

// ----- Foods -----
export interface Food {
    id: string;
    user_id: string;
    name: string;
    category: FoodCategory;
    description: string | null;
    image_url: string | null;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface FoodInsert {
    name: string;
    category: FoodCategory;
    description?: string | null;
    image_url?: string | null;
}

export interface FoodUpdate {
    name?: string;
    category?: FoodCategory;
    description?: string | null;
    image_url?: string | null;
    is_favorite?: boolean;
}

// ----- Food Lists -----
export interface FoodList {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export interface FoodListItem {
    id: string;
    list_id: string;
    food_id: string;
    created_at: string;
}

// ----- Selection History -----
export interface SelectionHistory {
    id: string;
    user_id: string | null;
    food_id: string | null;
    food_name: string;
    selection_method: SelectionMethod;
    selected_at: string;
}

// ----- Balance Games -----
export interface BalanceGame {
    id: string;
    food_a: string;
    food_b: string;
    selected: string;
    session_id: string | null;
    user_id: string | null;
    created_at: string;
}

// ----- Anonymous Status -----
export interface AnonymousStatus {
    id: string;
    food_name: string;
    session_id: string;
    created_at: string;
    expires_at: string;
}

// ----- Category Metadata -----
export const CATEGORY_MAP: Record<
    FoodCategory,
    { label: string; emoji: string; color: string }
> = {
    korean: { label: "한식", emoji: "🍚", color: "#E8590C" },
    chinese: { label: "중식", emoji: "🥟", color: "#D6336C" },
    japanese: { label: "일식", emoji: "🍣", color: "#AE3EC9" },
    western: { label: "양식", emoji: "🍝", color: "#1971C2" },
    fastfood: { label: "패스트푸드", emoji: "🍔", color: "#E67700" },
    dessert: { label: "디저트", emoji: "🍰", color: "#F06595" },
};
