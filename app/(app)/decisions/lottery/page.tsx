"use client";

import { useState, useMemo, useCallback } from "react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { Plus, Wand2, X, ArrowLeft, RefreshCw } from "lucide-react";
import { getRandomMenus } from "@/lib/decisions";

const STRAW_COLORS = [
    { bg: "var(--accent-pink)", pattern: "stripes" },
    { bg: "var(--accent-cyan)", pattern: "line" },
    { bg: "#facc15", pattern: "dots" },
    { bg: "var(--primary)", pattern: "checks" },
    { bg: "#4ade80", pattern: "bands" },
    { bg: "#f97316", pattern: "stripes" },
    { bg: "#a78bfa", pattern: "line" },
    { bg: "#fb7185", pattern: "dots" },
];

function buildStraws(options: string[]) {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.map((name, i) => ({
        name,
        color: STRAW_COLORS[i % STRAW_COLORS.length],
        height: 160 + Math.random() * 80,
        rotation: (i - Math.floor(arr.length / 2)) * 8 + (Math.random() - 0.5) * 6,
    }));
}

export default function LotteryPage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    const [isGameStarted, setIsGameStarted] = useState(false);
    const [shuffleKey, setShuffleKey] = useState(0);
    const [pulledIdx, setPulledIdx] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    // 옵션 추가
    const handleAddOption = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        if (options.includes(trimmed)) {
            toast("warning", "이미 추가된 항목입니다.");
            return;
        }
        if (options.length >= 8) {
            toast("warning", "최대 8개까지만 추가 가능합니다.");
            return;
        }
        setOptions([...options, trimmed]);
        setInputValue("");
    };

    // 옵션 제거
    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    // 아무거나 넣어줘 (랜덤 4~8개 섞기)
    const handleAutoSuggest = () => {
        const count = Math.floor(Math.random() * 5) + 4; // 4 ~ 8개
        setOptions(getRandomMenus(count));
        toast("success", "결정장애를 위한 랜덤 메뉴 장전 완료! 🔫");
    };

    // 제비뽑기 시작
    const handleStartGame = () => {
        if (options.length < 2) {
            toast("warning", "최소 2개 이상의 항목이 필요합니다.");
            return;
        }
        setIsGameStarted(true);
        setShuffleKey(k => k + 1);
        setPulledIdx(null);
        setIsRevealed(false);
    };

    // 옵션 리셋 및 뒤로 가기
    const handleReset = () => {
        setOptions([]);
        setIsGameStarted(false);
    };

    // 같은 옵션으로 게임 다시 돌리기 (Retry)
    const handleRetry = () => {
        setShuffleKey(k => k + 1);
        setPulledIdx(null);
        setIsRevealed(false);
    };

    const shuffled = useMemo(() => {
        if (!isGameStarted || options.length === 0) return [];
        return buildStraws(options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, shuffleKey, isGameStarted]);

    const handleShuffle = useCallback(() => {
        if (isShuffling) return;
        setIsShuffling(true);
        setPulledIdx(null);
        setIsRevealed(false);

        setTimeout(() => {
            setShuffleKey((k) => k + 1);
            setIsShuffling(false);
        }, 1200);
    }, [isShuffling]);

    const handlePull = (idx: number) => {
        if (pulledIdx !== null || isShuffling) return;
        setPulledIdx(idx);
        setTimeout(() => {
            setIsRevealed(true);
            const item = shuffled[idx];
            toast("success", `🎉 당첨! ${item.name}!`);
            addHistory({
                foodId: "", // 자체 메뉴
                foodName: item.name,
                method: "lottery",
            });
        }, 600);
    };

    const winner = pulledIdx !== null
        ? shuffled[pulledIdx].name
        : null;

    return (
        <AppLayout title="제비뽑기" showBack>
            <div className={`amu-lottery-page animate-fade-in ${!isGameStarted ? "p-4" : ""}`}>

                {/* Background Effects */}
                <div className="amu-lottery-bg">
                    <div className="amu-blob amu-blob--1 animate-float" />
                    <div className="amu-blob amu-blob--2 animate-float-delay" />
                    <div className="amu-lottery-bg__shape amu-lottery-bg__star animate-wiggle">
                        <span className="material-symbols-outlined">star</span>
                    </div>
                </div>

                {!isGameStarted ? (
                    // 1. 입력 폼 화면
                    <div className="relative z-10 flex flex-col gap-6 max-w-sm mx-auto w-full pt-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-2">무엇을 뽑을까요?</h2>
                            <p className="text-sm text-foreground-muted">결정할 항목들을 직접 입력하거나<br />마법사에게 추천을 받아보세요.</p>
                        </div>

                        {/* Recommendation Button */}
                        <button
                            onClick={handleAutoSuggest}
                            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-primary/10 border border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-glow"
                        >
                            <Wand2 size={20} />
                            알아서 추천해줘 🎲
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
                                placeholder="항목 입력 (예: 짬뽕)"
                                className="flex-1 bg-surface border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                title="항목 추가"
                                disabled={!inputValue.trim() || options.length >= 8}
                                className="w-12 h-12 flex items-center justify-center bg-surface-hover border border-border rounded-xl text-foreground hover:text-primary transition-colors disabled:opacity-50"
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
                                        title="삭제"
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
                                className="flex-[2] py-3 bg-gradient-to-r from-primary to-accent-pink text-white rounded-xl font-bold shadow-glow disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                제비뽑기 시작
                            </button>
                        </div>
                    </div>
                ) : (
                    // 2. 게임 화면 (기존 제비뽑기 뷰)
                    <div className="flex flex-col items-center flex-1 w-full h-full justify-between pb-6 pt-2">
                        {/* Status Header */}
                        <div className="w-full flex justify-between items-center px-4 mb-2 relative z-10">
                            <button
                                onClick={handleReset}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-foreground-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> 다시 입력
                            </button>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                총 {options.length}개
                            </span>
                        </div>

                        {/* Instruction Bubble */}
                        <div className="amu-lottery-bubble mt-0">
                            <p className="gradient-text" style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
                                {isShuffling
                                    ? "섞는 중... 🔀"
                                    : isRevealed
                                        ? winner
                                            ? `🎉 ${winner}!`
                                            : "아쉽! 꽝!"
                                        : pulledIdx !== null
                                            ? "뽑는 중..."
                                            : "하나를 뽑아보세요!"}
                            </p>
                        </div>

                        {/* Straws Container */}
                        <div className="amu-straws-area">
                            <div className={`amu-straws-container ${isShuffling ? "amu-straws--shuffling" : ""}`}>
                                {shuffled.map((item, idx) => (
                                    <div
                                        key={`${shuffleKey}-${idx}`}
                                        className={`amu-straw ${pulledIdx === idx ? "amu-straw--pulled" : ""} ${pulledIdx !== null && pulledIdx !== idx ? "amu-straw--dimmed" : ""} ${isShuffling ? "amu-straw--shake" : ""}`}
                                        style={{
                                            background: item.color.bg,
                                            height: item.height,
                                            transform: `rotate(${item.rotation}deg)`,
                                            animationDelay: isShuffling ? `${idx * 0.08}s` : undefined,
                                        }}
                                        onClick={() => handlePull(idx)}
                                    >
                                        <div className={`amu-straw__pattern amu-straw__pattern--${item.color.pattern}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Wobbly Box */}
                            <div className={`amu-straw-box ${isShuffling ? "amu-straw-box--shake" : ""}`}>
                                <div className="amu-straw-box__inner">
                                    <h2 className="amu-straw-box__logo">AMU</h2>
                                    <div className="amu-straw-box__line" />
                                </div>
                            </div>
                        </div>

                        {/* Result */}
                        {isRevealed && winner && (
                            <div className="amu-lottery-result animate-fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
                                <div className="amu-lottery-result__emoji text-4xl mb-2">🎉</div>
                                <h2 className="amu-lottery-result__name gradient-text text-3xl mb-6">{winner}</h2>
                                <button
                                    onClick={handleRetry}
                                    className="amu-cta amu-cta--primary w-auto px-6 py-3 rounded-full flex items-center gap-2 shadow-glow font-bold text-base hover:scale-105 transition-transform cursor-pointer pointer-events-auto"
                                    title="같은 후보로 다시 뽑기"
                                >
                                    <RefreshCw size={18} />
                                    다시 뽑기
                                </button>
                            </div>
                        )}

                        {/* Bottom Shuffle Button */}
                        <div className="amu-lottery-bottom w-full px-4 mt-8 relative z-10">
                            <button
                                className={`amu-lottery-shuffle-btn ${isShuffling ? "amu-lottery-shuffle-btn--active" : ""}`}
                                onClick={handleShuffle}
                                disabled={isShuffling}
                            >
                                <span className={`material-symbols-outlined ${isShuffling ? "amu-icon-spin" : ""}`}>
                                    refresh
                                </span>
                                {isShuffling ? "섞는 중..." : "제비 섞기"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}


