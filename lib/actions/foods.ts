import { createClient } from "@/lib/supabase/client";
import type { Food, FoodCategory } from "@/types/database";
import type { FoodCreateInput, FoodUpdateInput } from "@/lib/validations/food";

// ============================================================
// Food CRUD — Supabase 직접 호출 (RLS로 보안)
// ============================================================

const supabase = () => createClient();

/** 음식 목록 조회 (카테고리 필터, 검색어) */
export async function getFoods(params?: {
    category?: FoodCategory;
    search?: string;
    favoritesOnly?: boolean;
}) {
    let query = supabase()
        .from("foods")
        .select("*")
        .order("created_at", { ascending: false });

    if (params?.category) {
        query = query.eq("category", params.category);
    }
    if (params?.search) {
        query = query.ilike("name", `%${params.search}%`);
    }
    if (params?.favoritesOnly) {
        query = query.eq("is_favorite", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Food[];
}

/** 음식 단건 조회 */
export async function getFood(id: string) {
    const { data, error } = await supabase()
        .from("foods")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as Food;
}

/** 음식 추가 */
export async function createFood(input: FoodCreateInput) {
    const { data: userData } = await supabase().auth.getUser();
    if (!userData.user) throw new Error("로그인이 필요합니다");

    const { data, error } = await supabase()
        .from("foods")
        .insert({
            ...input,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Food;
}

/** 음식 수정 */
export async function updateFood(id: string, input: FoodUpdateInput) {
    const { data, error } = await supabase()
        .from("foods")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as Food;
}

/** 음식 삭제 */
export async function deleteFood(id: string) {
    const { error } = await supabase().from("foods").delete().eq("id", id);
    if (error) throw error;
}

/** 즐겨찾기 토글 */
export async function toggleFavorite(id: string, currentValue: boolean) {
    return updateFood(id, { is_favorite: !currentValue });
}
