"use server";

import { createClient } from "@/lib/supabase/server";

export type SelectionMethod = "random" | "spinwheel" | "dice" | "filter" | "lottery" | "balance" | "grid_mandalart" | "dart";

export async function addHistory(
    foodId: string | null,
    foodName: string,
    method: SelectionMethod
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
        .from("selection_history")
        .insert({
            user_id: user.id,
            food_id: foodId,
            food_name: foodName,
            selection_method: method,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getHistory(limit = 50) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("selection_history")
        .select(`
      *,
      food:foods (
        category,
        image_url
      )
    `)
        .eq("user_id", user.id)
        .order("selected_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
}

export async function getStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Supabase RPC나 Group By 쿼리를 쓰면 좋지만, 여기선 단순함을 위해 데이터를 가져와서 집계
    const { data, error } = await supabase
        .from("selection_history")
        .select("food_name, selection_method, selected_at")
        .eq("user_id", user.id);

    if (error) throw error;

    const methodCounts: Record<string, number> = {};
    const foodCounts: Record<string, number> = {};
    let total = 0;

    data.forEach((row) => {
        total++;
        methodCounts[row.selection_method] = (methodCounts[row.selection_method] || 0) + 1;
        foodCounts[row.food_name] = (foodCounts[row.food_name] || 0) + 1;
    });

    const topFoods = Object.entries(foodCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    return { total, methodCounts, topFoods };
}
