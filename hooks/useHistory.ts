import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addHistory, getHistory, getStats, type SelectionMethod } from "@/lib/actions/history";

export function useHistory() {
    return useQuery({
        queryKey: ["history"],
        queryFn: () => getHistory(),
    });
}

export function useStats() {
    return useQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(),
    });
}

export function useAddHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            foodId,
            foodName,
            method,
        }: {
            foodId: string | null;
            foodName: string;
            method: SelectionMethod;
        }) => addHistory(foodId, foodName, method),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        },
    });
}
