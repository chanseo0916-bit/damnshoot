"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Wand2, Plus, X, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { getRandomMenus } from "@/lib/decisions";

// 토너먼트 밸런스 게임을 위한 유틸
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function BalancePage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    // 1. 입력 폼 상태
    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isGameStarted, setIsGameStarted] = useState(false);

    // 2. 게임 상태 (토너먼트 방식)
    const [currentRoundOptions, setCurrentRoundOptions] = useState<string[]>([]);
    const [nextRoundOptions, setNextRoundOptions] = useState<string[]>([]);
    const [pair, setPair] = useState<[string, string] | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [winner, setWinner] = useState<string | null>(null);

    // --- Options Input Section --- 

    const handleAddOption = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        if (options.includes(trimmed)) {
            toast("warning", "이미 추가된 항목입니다.");
            return;
        }
        if (options.length >= 16) {
            toast("warning", "최대 16개까지만 추가 가능합니다.");
            return;
        }
        setOptions([...options, trimmed]);
        setInputValue("");
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleAutoSuggest = () => {
        const count = 16; // 밸런스게임은 짝수개(16개 토너먼트)가 안정적입니다
        setOptions(getRandomMenus(count));
        toast("success", "결정장애를 위한 16강 라인업 장전 완료! ⚔️");
    };

    const handleReset = () => {
        setOptions([]);
        setIsGameStarted(false);
        setWinner(null);
    };

    const setupMatch = (pool: string[]) => {
        if (pool.length >= 2) {
            setPair([pool[0], pool[1]]);
            setCurrentRoundOptions(pool.slice(2));
        } else if (pool.length === 1 && nextRoundOptions.length > 0) {
            // 부전승 처리 후 다음 라운드로
            const newNext = [...nextRoundOptions, pool[0]];
            startRound(newNext);
        } else if (pool.length === 1 && nextRoundOptions.length === 0) {
            // 최종 우승자
            setWinner(pool[0]);
            toast("success", `🎉 최종 승자: ${pool[0]}!`);
            addHistory({
                foodId: "",
                foodName: pool[0],
                method: "balance",
            });
        }
    };

    const startRound = (pool: string[]) => {
        const shuffled = shuffleArray(pool);
        setNextRoundOptions([]);
        setupMatch(shuffled);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            toast("warning", "최소 2개 이상의 항목이 필요합니다.");
            return;
        }
        setIsGameStarted(true);
        setWinner(null);
        startRound(options);
    };

    // --- Balance Gameplay Section ---

    const handleSelect = (side: "left" | "right") => {
        if (!pair || selected) return;

        const choice = side === "left" ? pair[0] : pair[1];
        setSelected(choice);

        setTimeout(() => {
            const nextPool = [...nextRoundOptions, choice];
            setNextRoundOptions(nextPool);
            setSelected(null);

            // 현재 라운드 매치 남았는지 확인
            if (currentRoundOptions.length > 0) {
                setupMatch([...currentRoundOptions]);
            } else {
                // 다음 라운드 돌입 또는 최종 우승 결정
                if (nextPool.length > 1) {
                    startRound(nextPool);
                } else {
                    setWinner(nextPool[0]);
                    toast("success", `🎉 최종 승자: ${nextPool[0]}!`);
                    addHistory({
                        foodId: "",
                        foodName: nextPool[0],
                        method: "balance",
                    });
                }
            }
        }, 500); // 선택 후 살짝 딜레이 처리
    };

    const handleRetry = () => {
        setWinner(null);
        startRound(options);
    };

    // 현재 총 라운드 짐작용 (표시용)
    const totalRemainingStr = currentRoundOptions.length + nextRoundOptions.length + (pair ? 2 : 0);
    const roundName = totalRemainingStr === 2 ? "결승전 🏆" : totalRemainingStr === 4 ? "준결승 (4강)" : `${totalRemainingStr}강`;

    return (
        <AppLayout title="밸런스 게임" showBack>
            <div className={`amu-lottery-page animate-fade-in ${!isGameStarted ? "p-4" : ""}`}>

                {/* Background Effects */}
                <div className="amu-lottery-bg">
                    <div className="amu-blob amu-blob--1 animate-float bg-orange-500" />
                    <div className="amu-blob amu-blob--2 animate-float-delay bg-violet-400" />
                    <div className="amu-lottery-bg__shape amu-lottery-bg__circle animate-wiggle">
                        <span className="material-symbols-outlined">compare_arrows</span>
                    </div>
                </div>

                {!isGameStarted ? (
                    // 1. 입력 폼 화면
                    <div className="relative z-10 flex flex-col gap-6 max-w-sm mx-auto w-full pt-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-2">어떤 메뉴들로 겨룰까요?</h2>
                            <p className="text-sm text-foreground-muted">최후의 1개를 가리는 서바이벌 매치!<br />마법사에게 8강 추천을 받아보세요.</p>
                        </div>

                        {/* Recommendation Button */}
                        <button
                            onClick={handleAutoSuggest}
                            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-primary/10 border border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-glow"
                        >
                            <Wand2 size={20} />
                            아무거나 넣어줘 (8강 자동) 🎲
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-border"></div>
                            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">직접 입력</span>
                            <div className="flex-1 h-px bg-border"></div>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleAddOption} className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="항목 입력 (예: 피자)"
                                className="flex-1 bg-surface border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-orange-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || options.length >= 16}
                                className="w-12 h-12 flex items-center justify-center bg-surface-hover border border-border rounded-xl text-foreground hover:text-orange-500 transition-colors disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>
                        </form>

                        {/* Options List */}
                        <div className="flex flex-col gap-2">
                            {options.map((opt, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl animate-scale-in">
                                    <span className="font-semibold text-foreground text-sm pl-2">{opt}</span>
                                    <button
                                        onClick={() => handleRemoveOption(i)}
                                        className="text-foreground-muted hover:text-danger p-1 rounded-md hover:bg-danger/10 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {options.length === 0 && (
                                <div className="text-center py-8 text-foreground-muted border border-dashed border-border rounded-xl">
                                    추가된 항목이 없습니다.
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleReset}
                                disabled={options.length === 0}
                                className="flex-1 py-3 bg-surface border border-border rounded-xl font-semibold text-foreground-muted hover:text-foreground disabled:opacity-50"
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleStartGame}
                                disabled={options.length < 2}
                                className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-glow disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                서바이벌 시작
                            </button>
                        </div>
                    </div>
                ) : (
                    // 2. 밸런스 게임 토너먼트 화면
                    <div className="flex flex-col items-center flex-1 w-full h-full pb-6 pt-2 relative z-10 px-4">
                        {/* Status Header */}
                        <div className="w-full flex justify-between items-center mb-6">
                            <button
                                onClick={handleReset}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-foreground-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> 다시 입력
                            </button>
                            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
                                {roundName}
                            </span>
                        </div>

                        {!winner && pair ? (
                            <>
                                <div className="amu-lottery-bubble mt-0 mb-8">
                                    <p className="gradient-text text-center text-orange-400 font-bold text-lg m-0">
                                        둘 중 하나만 선택하세요!
                                    </p>
                                </div>

                                <div className="w-full flex flex-col gap-4 max-w-sm mt-4">
                                    {/* Left Card */}
                                    <button
                                        onClick={() => handleSelect("left")}
                                        className={`w-full aspect-video rounded-3xl border-4 ${selected === pair[0] ? "border-orange-500 shadow-glow scale-105" : selected === pair[1] ? "border-surface opacity-30 blur-[2px] scale-95" : "border-surface hover:border-orange-500 hover:scale-105"} bg-surface-hover flex items-center justify-center transition-all`}
                                    >
                                        <h3 className="text-3xl font-display font-bold text-foreground">{pair[0]}</h3>
                                    </button>

                                    <div className="flex items-center justify-center py-2 h-10">
                                        <div className="px-4 py-2 bg-background-dark border border-border rounded-full text-foreground-muted font-bold text-lg tracking-widest shadow-glow">VS</div>
                                    </div>

                                    {/* Right Card */}
                                    <button
                                        onClick={() => handleSelect("right")}
                                        className={`w-full aspect-video rounded-3xl border-4 ${selected === pair[1] ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105" : selected === pair[0] ? "border-surface opacity-30 blur-[2px] scale-95" : "border-surface hover:border-amber-500 hover:scale-105"} bg-surface-hover flex items-center justify-center transition-all`}
                                    >
                                        <h3 className="text-3xl font-display font-bold text-foreground">{pair[1]}</h3>
                                    </button>
                                </div>
                            </>
                        ) : winner && (
                            // Winner Screen
                            <div className="flex flex-col items-center justify-center flex-1 w-full animate-fade-in-up mt-8">
                                <div className="text-6xl mb-4">👑</div>
                                <h3 className="text-lg font-bold text-foreground-muted mb-2">최후의 승자!</h3>
                                <h1 className="text-5xl font-display font-bold gradient-text text-orange-500 mb-12 text-center break-keep">
                                    {winner}
                                </h1>

                                <div className="w-full flex flex-col gap-3 max-w-xs mt-auto">
                                    <button
                                        onClick={handleRetry}
                                        title="결과 무시하고 다시하기"
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow hover:scale-105 transition-transform"
                                    >
                                        <RefreshCw size={20} />
                                        같은 후보로 다시 서바이벌
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
