"use client";

import { useStats } from "@/hooks/useHistory";
import { AppLayout } from "@/components/layout/Header";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const METHOD_LABELS: Record<string, string> = {
    random: "랜덤",
    spinwheel: "스핀휠",
    dice: "주사위",
    filter: "필터",
    lottery: "제비뽑기",
    balance: "밸런스"
};

export default function StatsPage() {
    const { data: stats, isLoading } = useStats();

    const methodData = stats ? Object.entries(stats.methodCounts).map(([method, count]) => ({
        name: METHOD_LABELS[method] || method,
        count
    })) : [];

    return (
        <AppLayout>
            <div className="animate-fade-in max-w-5xl mx-auto">
                <div className="ds-page-header">
                    <h1 className="ds-page-header__title">📊 내 결정 통계</h1>
                    <p className="ds-page-header__subtitle">
                        나의 음식 선택 성향과 가장 많이 사용한 결정 도구를 분석합니다.
                    </p>
                </div>

                {isLoading ? (
                    <p className="text-foreground-muted">통계를 불러오는 중...</p>
                ) : stats ? (
                    <div className="flex flex-col gap-6">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                            <div className="ds-card ds-card--glass ds-card--pad-lg text-center">
                                <div className="text-sm text-foreground-secondary mb-2">총 결정 횟수</div>
                                <div className="text-4xl font-extrabold text-primary">{stats.total}회</div>
                            </div>
                            <div className="ds-card ds-card--glass ds-card--pad-lg text-center">
                                <div className="text-sm text-foreground-secondary mb-2">가장 많이 먹은 음식</div>
                                <div className="text-2xl font-bold mt-2.5">
                                    {stats.topFoods[0]?.name || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 items-start">
                            {/* Method Chart */}
                            <div className="ds-card ds-card--default p-6">
                                <h3 className="ds-card__title mb-6">도구별 사용 빈도</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={methodData}>
                                            <XAxis dataKey="name" stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                                                itemStyle={{ color: "var(--primary)" }}
                                            />
                                            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Foods List */}
                            <div className="ds-card ds-card--default p-6">
                                <h3 className="ds-card__title mb-5">TOP 5 선정 메뉴</h3>
                                <div className="flex flex-col gap-3">
                                    {stats.topFoods.map((f, i) => (
                                        <div key={f.name} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary text-white" : "bg-border text-foreground"}`}>
                                                    {i + 1}
                                                </div>
                                                <span className="font-semibold">{f.name}</span>
                                            </div>
                                            <span className="text-primary font-bold">{f.count}회</span>
                                        </div>
                                    ))}
                                    {stats.topFoods.length === 0 && (
                                        <p className="text-foreground-muted text-center py-5">기록이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📊</div>
                        <h3 className="empty-state__title">통계 데이터가 없어요</h3>
                        <p className="empty-state__desc">결정 도구를 한 번 이상 사용해야 분석이 시작됩니다.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
