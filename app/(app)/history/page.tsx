"use client";

import { useHistory } from "@/hooks/useHistory";
import { AppLayout } from "@/components/layout/Header";
import { CATEGORY_MAP } from "@/types/database";
import type { FoodCategory } from "@/types/database";
import { History as HistoryIcon, Clock, ChevronRight, Shuffle } from "lucide-react";

const METHOD_LABELS: Record<string, string> = {
    random: "🎰 랜덤 선택",
    spinwheel: "🎡 스핀휠",
    dice: "🎲 주사위",
    filter: "🔍 조건 필터",
    lottery: "🎫 제비뽑기",
    balance: "⚔️ 밸런스게임"
};

export default function HistoryPage() {
    const { data: historyItems, isLoading } = useHistory();

    return (
        <AppLayout>
            <div className="animate-fade-in max-w-4xl mx-auto">
                <div className="ds-page-header">
                    <h1 className="ds-page-header__title">📜 선택 히스토리</h1>
                    <p className="ds-page-header__subtitle">
                        그동안 어떤 메뉴들을 결정해왔는지 확인해보세요.
                    </p>
                </div>

                {isLoading ? (
                    <p className="text-foreground-muted">기록을 불러오는 중...</p>
                ) : historyItems && historyItems.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {historyItems.map((item: any) => {
                            const category = item.food?.category as FoodCategory | undefined;
                            const cat = category ? CATEGORY_MAP[category] : null;
                            const date = new Date(item.selected_at).toLocaleDateString("ko-KR", {
                                year: "numeric", month: "long", day: "numeric", weekday: "short"
                            });
                            const time = new Date(item.selected_at).toLocaleTimeString("ko-KR", {
                                hour: "2-digit", minute: "2-digit"
                            });

                            return (
                                <div key={item.id} className="ds-card ds-card--default ds-card--hoverable flex items-center justify-between px-5 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-3xl ${cat ? 'opacity-100' : 'opacity-40'}`}>
                                            {cat ? cat.emoji : "🍽️"}
                                        </div>
                                        <div>
                                            <h3 className="m-0 mb-1 text-base font-bold">
                                                {item.food_name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[13px] text-foreground-muted">
                                                <span className="flex items-center gap-1">
                                                    <Shuffle size={14} /> {item.method}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {date} {time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📝</div>
                        <h3 className="empty-state__title">아직 결정 기록이 없어요</h3>
                        <p className="empty-state__desc">결정 도구를 사용해서 메뉴를 골라보세요!</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
