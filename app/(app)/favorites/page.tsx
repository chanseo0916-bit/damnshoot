"use client";

import { AppLayout } from "@/components/layout/Header";
import { FoodCard } from "@/components/food/FoodCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useFoods, useToggleFavorite } from "@/hooks/useFoods";
import type { Food } from "@/types/database";

export default function FavoritesPage() {
    const { toast } = useToast();
    const { data: foods, isLoading } = useFoods({ favoritesOnly: true });
    const favoriteMutation = useToggleFavorite();

    const handleToggle = async (food: Food) => {
        try {
            await favoriteMutation.mutateAsync({ id: food.id, currentValue: food.is_favorite });
            toast("success", "즐겨찾기 해제");
        } catch {
            toast("error", "실패했습니다.");
        }
    };

    return (
        <AppLayout>
            <div className="animate-fade-in">
                <div className="ds-page-header">
                    <h1 className="ds-page-header__title">⭐ 즐겨찾기</h1>
                    <p className="ds-page-header__subtitle">자주 먹는 음식을 모아두세요</p>
                </div>

                {isLoading ? (
                    <div className="food-grid">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} height={160} rounded="lg" />
                        ))}
                    </div>
                ) : foods && foods.length > 0 ? (
                    <div className="food-grid">
                        {foods.map((food) => (
                            <FoodCard key={food.id} food={food} onToggleFavorite={handleToggle} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">⭐</div>
                        <h3 className="empty-state__title">즐겨찾기가 비어있어요</h3>
                        <p className="empty-state__desc">
                            음식 목록에서 ♥ 버튼을 눌러 즐겨찾기에 추가하세요
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
