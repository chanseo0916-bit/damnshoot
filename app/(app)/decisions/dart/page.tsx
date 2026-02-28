"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { getRandomMenus } from "@/lib/decisions";
import { RefreshCw, Wand2, Plus, X, ArrowLeft } from "lucide-react";

const COLORS = [
    "rgba(140, 43, 238, 0.4)",  // primary
    "rgba(0, 240, 255, 0.3)",   // secondary
    "rgba(204, 255, 0, 0.3)",   // lime
    "rgba(255, 0, 170, 0.3)",   // accent
];

export default function DartGamePage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isGameStarted, setIsGameStarted] = useState(false);

    const [isThrowing, setIsThrowing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    // 휠 회전 상태 제어
    const [rotation, setRotation] = useState(0);
    const isSpinningRef = useRef(true);
    const rotationRef = useRef(0);
    const requestRef = useRef<number | undefined>(undefined);

    // --- Options Input Section ---
    const handleAddOption = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        if (options.includes(trimmed)) {
            toast("warning", "이미 추가된 항목입니다.");
            return;
        }
        if (options.length >= 12) {
            toast("warning", "최대 12개까지만 추가 가능합니다.");
            return;
        }
        setOptions([...options, trimmed]);
        setInputValue("");
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleAutoSuggest = () => {
        const count = Math.floor(Math.random() * 5) + 6; // 6 ~ 10개
        setOptions(getRandomMenus(count));
        toast("success", "결정장애를 위한 랜덤 메뉴 장전 완료! 🔫");
    };

    const handleResetOptions = () => {
        setOptions([]);
        setIsGameStarted(false);
        setResult(null);
        setRotation(0);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            toast("warning", "최소 2개 이상의 항목이 필요합니다.");
            return;
        }
        setIsGameStarted(true);
        setResult(null);
        setRotation(0);
        isSpinningRef.current = true;
    };

    // --- Animation Section ---
    const animate = (time: number) => {
        if (isSpinningRef.current) {
            rotationRef.current = (rotationRef.current + 1.5) % 360; // 속도 조절
            setRotation(rotationRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isGameStarted) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isGameStarted]);

    const handleThrow = () => {
        if (isThrowing || result || options.length === 0) return;

        setIsThrowing(true);
        isSpinningRef.current = false;

        setTimeout(() => {
            const sliceAngle = 360 / options.length;
            const normalizedRotation = (360 - rotationRef.current) % 360;
            const indexFloat = normalizedRotation / sliceAngle;
            let hitIndex = Math.round(indexFloat) % options.length;

            if (hitIndex < 0) hitIndex += options.length;

            const selectedMenu = options[hitIndex];

            setResult(selectedMenu);
            setIsThrowing(false);

            toast("success", `🎯 명중! [${selectedMenu}] 당첨!`);
            addHistory({
                foodId: "",
                foodName: selectedMenu,
                method: "dart",
            });
        }, 1000);
    };

    const handleRetry = () => {
        setResult(null);
        setIsThrowing(false);
        isSpinningRef.current = true;
    };

    const sliceAngle = options.length > 0 ? 360 / options.length : 360;

    return (
        <AppLayout title="네온 다트 던지기" showBack>
            <div className={`amu-lottery-page animate-fade-in ${!isGameStarted ? "p-4" : ""}`}>
                {/* Ambient Background Glow */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[100px]" />
                </div>

                {!isGameStarted ? (
                    // 1. 입력 폼 화면 
                    <div className="relative z-10 flex flex-col gap-6 max-w-sm mx-auto w-full pt-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-2">다트판에 무엇을 붙일까요?</h2>
                            <p className="text-sm text-foreground-muted">결정할 항목들을 직접 입력하거나<br />마법사에게 추천을 받아보세요.</p>
                        </div>

                        {/* Recommendation Button */}
                        <button
                            onClick={handleAutoSuggest}
                            className="amu-cta amu-cta--ghost w-full"
                        >
                            <Wand2 size={20} />
                            아무거나 넣어줘 🎲
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
                                placeholder="항목 입력 (예: 돈까스)"
                                className="flex-1 bg-surface border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                title="항목 추가"
                                disabled={!inputValue.trim() || options.length >= 12}
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

                        <div className="flex gap-2 mt-4 pb-20">
                            <button
                                onClick={handleResetOptions}
                                disabled={options.length === 0}
                                className="flex-1 py-3 bg-surface border border-border rounded-xl font-semibold text-foreground-muted hover:text-foreground disabled:opacity-50"
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleStartGame}
                                disabled={options.length < 2}
                                className="amu-cta amu-cta--primary flex-[2]"
                            >
                                다트 돌리러 가기
                            </button>
                        </div>
                    </div>
                ) : (
                    // 2. 다트 게임 화면
                    <div className="flex flex-col items-center flex-1 w-full h-full relative z-10 animate-fade-in overflow-hidden">
                        {/* Status Header */}
                        <div className="w-full flex justify-between items-center px-4 mb-4 pt-2">
                            <button
                                onClick={handleResetOptions}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-foreground-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> 다시 입력
                            </button>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                총 {options.length}칸
                            </span>
                        </div>

                        <div className="text-center space-y-2 mt-0 relative z-10 w-full px-6">
                            <h2 className="text-3xl font-black text-white neon-text uppercase tracking-widest italic transform -rotate-2">Aim & Flick!</h2>
                            <p className="text-slate-400 text-sm font-medium">타이밍을 맞춰 다트를 던지세요</p>
                        </div>

                        {/* Dartboard Container */}
                        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center mt-6 mb-2">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full border border-primary/30 shadow-[0_0_40px_rgba(140,43,238,0.3)] animate-pulse" />
                            <div className="absolute inset-4 rounded-full border border-secondary/20" />

                            {/* The Dartboard */}
                            <div className="relative w-[90%] h-[90%] rounded-full overflow-hidden border-8 border-surface-dark shadow-2xl bg-[#2a1b3d]">
                                {/* Dynamic Segments */}
                                <div
                                    className="absolute inset-0 transition-transform"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                    {options.map((opt, i) => {
                                        const angle = i * sliceAngle;
                                        const color = COLORS[i % COLORS.length];

                                        return (
                                            <div
                                                key={opt + i}
                                                className="absolute top-0 left-1/2 w-[2px] h-1/2 origin-bottom border-l"
                                                style={{
                                                    transform: `translateX(-50%) rotate(${angle}deg)`,
                                                    borderColor: 'rgba(255,255,255,0.15)',
                                                    background: `linear-gradient(to right, ${color}, transparent)`
                                                }}
                                            >
                                                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2">
                                                    <span
                                                        className="text-[11px] font-bold text-white drop-shadow-md"
                                                        style={{
                                                            writingMode: 'vertical-rl',
                                                            textOrientation: 'mixed',
                                                            transform: 'rotate(180deg)',
                                                            textShadow: `0 0 5px ${color.replace(/[\d.]+\)$/g, '0.8)')}`
                                                        }}
                                                    >
                                                        {opt}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Bullseye */}
                                <div className="absolute inset-0 m-auto w-16 h-16 bg-surface-dark rounded-full border-4 border-accent flex items-center justify-center z-10 shadow-lg shadow-[0_0_15px_rgba(140,43,238,0.5),inset_0_0_15px_rgba(140,43,238,0.2)]">
                                    <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                                </div>
                            </div>

                            {/* Target Arrow Indicator */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-accent z-20 drop-shadow-[0_0_8px_rgba(255,0,170,0.8)] pointer-events-none">
                                <span className="material-symbols-outlined rotate-180 text-3xl">play_arrow</span>
                            </div>

                            {/* Result Overlay on Board */}
                            {result && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center animate-scale-in pointer-events-none">
                                    <div className="bg-background-dark/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-accent/50 shadow-[0_0_30px_rgba(255,0,170,0.5)]">
                                        <p className="text-white font-bold text-2xl neon-text">{result}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dart Interaction Area */}
                        <div className="relative w-full flex-1 flex flex-col items-center justify-end pb-8 z-20">
                            {!result ? (
                                <>
                                    <div className={`absolute top-0 left-0 right-0 text-center transition-opacity duration-300 ${isThrowing ? 'opacity-0' : 'opacity-60'}`}>
                                        <span className="text-xs text-white uppercase tracking-widest font-semibold bg-surface-dark/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 animate-pulse">
                                            Click to throw
                                        </span>
                                    </div>

                                    <div className={`absolute bottom-20 h-24 w-[2px] border-l-2 border-dashed transition-all duration-300 ${isThrowing ? 'border-accent/40 h-48 bottom-32 opacity-0' : 'border-white/20'}`} />

                                    {/* The Dart */}
                                    <div
                                        onClick={handleThrow}
                                        className={`relative group cursor-pointer z-30 transition-all duration-700 ease-out flex flex-col items-center
                                            ${isThrowing ? '-translate-y-48 scale-50 opacity-0' : 'hover:scale-110 translate-y-0'}
                                        `}
                                    >
                                        <div className="w-10 h-32 flex flex-col items-center drop-shadow-[0_0_10px_rgba(204,255,0,0.6)]">
                                            <div className="w-2 h-8 bg-gradient-to-b from-slate-300 to-slate-500 rounded-t-full" />
                                            <div className="w-4 h-12 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 rounded-sm my-[-2px] relative z-10">
                                                <div className="w-full h-[2px] bg-black/20 mt-2" />
                                                <div className="w-full h-[2px] bg-black/20 mt-2" />
                                                <div className="w-full h-[2px] bg-black/20 mt-2" />
                                            </div>
                                            <div className="w-12 h-14 relative mt-[-4px]">
                                                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-slate-800" />
                                                <div className="absolute top-0 left-0 w-1/2 h-full bg-[#ccff00]/80 rounded-tl-lg skew-y-12 border-l border-white/20" />
                                                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#ccff00]/80 rounded-tr-lg -skew-y-12 border-r border-white/20" />
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#ccff00]/40 blur-sm rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full max-w-xs animate-fade-in-up mt-4">
                                    <button
                                        onClick={handleRetry}
                                        className="amu-cta amu-cta--primary w-full"
                                    >
                                        <RefreshCw size={20} />
                                        다트 다시 던지기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
