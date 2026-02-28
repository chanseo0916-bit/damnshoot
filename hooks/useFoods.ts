import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFoods, getFood, createFood, updateFood, deleteFood, toggleFavorite } from "@/lib/actions/foods";
import type { FoodCategory } from "@/types/database";
import type { FoodCreateInput, FoodUpdateInput } from "@/lib/validations/food";

// ============================================================
// Food Query Hooks — TanStack Query
// ============================================================

/** 음식 목록 */
export function useFoods(params?: {
    category?: FoodCategory;
    search?: string;
    favoritesOnly?: boolean;
}) {
    return useQuery({
        queryKey: ["foods", params],
        queryFn: () => getFoods(params),
    });
}

/** 음식 단건 */
export function useFood(id: string) {
    return useQuery({
        queryKey: ["foods", id],
        queryFn: () => getFood(id),
        enabled: !!id,
    });
}

/** 음식 추가 */
export function useCreateFood() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: FoodCreateInput) => createFood(input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["foods"] });
        },
    });
}

/** 음식 수정 */
export function useUpdateFood() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: FoodUpdateInput }) =>
            updateFood(id, input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["foods"] });
        },
    });
}

/** 음식 삭제 */
export function useDeleteFood() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteFood(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["foods"] });
        },
    });
}

/** 즐겨찾기 토글 */
export function useToggleFavorite() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, currentValue }: { id: string; currentValue: boolean }) =>
            toggleFavorite(id, currentValue),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["foods"] });
        },
    });
}
