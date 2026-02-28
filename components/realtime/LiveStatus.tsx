"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 최근에 결정된 메뉴들의 간소화된 로그
type LiveEvent = {
    id: string;
    food_name: string;
    created_at: string;
};

export function LiveStatus() {
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const supabase = createClient();

    useEffect(() => {
        // 1) 초기화: 최근(5분 이내) 기록 3개 가져오기
        const fetchRecent = async () => {
            const fiveMinsAgo = new Date();
            fiveMinsAgo.setMinutes(fiveMinsAgo.getMinutes() - 5);

            const { data } = await supabase
                .from("selection_history")
                .select("id, food_name, selected_at")
                .gte("selected_at", fiveMinsAgo.toISOString())
                .order("selected_at", { ascending: false })
                .limit(3);

            if (data) {
                setEvents(data.map((d) => ({
                    id: d.id,
                    food_name: d.food_name,
                    created_at: d.selected_at,
                })));
            }
        };

        fetchRecent();

        // 2) 실시간 구독 (INSERT 발생 시 목록 갱신)
        const channel = supabase
            .channel("public:selection_history")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "selection_history" },
                (payload) => {
                    const newEvt = payload.new;
                    setEvents((prev) => {
                        const updatedEvents = [{
                            id: newEvt.id,
                            food_name: newEvt.food_name,
                            created_at: newEvt.selected_at
                        }, ...prev];
                        return updatedEvents.slice(0, 3); // 최대 3개까지만
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    if (events.length === 0) return null;

    return (
        <div className="live-status animate-fade-in flex items-center gap-2 p-3 bg-surface border border-border rounded-xl mb-6 shadow-sm">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span>방금 누군가 <b style={{ color: "var(--primary)" }}>{events[0].food_name}</b> 선택!</span>
        </div >
    );
}
