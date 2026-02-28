"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Wand2, Plus, X } from "lucide-react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { getRandomMenus } from "@/lib/decisions";

export default function DiceRollPage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isGameStarted, setIsGameStarted] = useState(false);

    const [isRolling, setIsRolling] = useState(false);
    const [diceNumber, setDiceNumber] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);

    // --- Options Input Section --- 

    const handleAddOption = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        if (options.includes(trimmed)) {
            toast("warning", "이미 추가된 항목입니다.");
            return;
        }
        if (options.length >= 8) {
            toast("warning", "최대 8개까지 추가 가능합니다.");
            return;
        }
        setOptions([...options, trimmed]);
        setInputValue("");
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleAutoSuggest = () => {
        const count = Math.floor(Math.random() * 5) + 4; // 4 ~ 8개
        setOptions(getRandomMenus(count));
        toast("success", "결정장애를 위한 랜덤 메뉴 장전 완료! 🔫");
    };

    const handleReset = () => {
        setOptions([]);
        setIsGameStarted(false);
        setResult(null);
        setDiceNumber(null);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            toast("warning", "최소 2개 이상의 항목이 필요합니다.");
            return;
        }
        setIsGameStarted(true);
        setResult(null);
        setDiceNumber(null);
    };

    // --- Dice Rolling Section ---

    const roll = useCallback(() => {
        if (options.length === 0) return;

        setResult(null);
        setDiceNumber(null);
        setIsRolling(true);

        const maxNum = options.length;
        let count = 0;
        const totalSteps = 15 + Math.floor(Math.random() * 10);
        const finalIdx = Math.floor(Math.random() * maxNum);

        const tick = () => {
            const randomNum = Math.floor(Math.random() * maxNum) + 1;
            setDiceNumber(randomNum);
            count++;

            if (count >= totalSteps) {
                setDiceNumber(finalIdx + 1); // 표시는 1-based index
                setResult(options[finalIdx]);
                setIsRolling(false);
                toast("success", `🎉 ${finalIdx + 1}번: ${options[finalIdx]} 당첨!`);
                addHistory({
                    foodId: "", // 자체 메뉴
                    foodName: options[finalIdx],
                    method: "dice",
                });
                return;
            }

            const delay = 60 + (count / totalSteps) * 200;
            setTimeout(tick, delay);
        };

        tick();
    }, [options, toast, addHistory]);

    // Retry (다시 굴리기)
    const handleRetry = () => {
        setResult(null);
        setDiceNumber(null);
        roll();
    };

    return (
        <AppLayout title="주사위 굴리기" showBack>
            <div className={`amu-lottery-page animate-fade-in ${!isGameStarted ? "p-4" : ""}`}>

                {/* Background Effects */}
                <div className="amu-lottery-bg">
                    <div className="amu-blob amu-blob--1 animate-float" style={{ background: 'var(--accent-pink)' }} />
                    <div className="amu-blob amu-blob--2 animate-float-delay" style={{ background: '#facc15' }} />
                    <div className="amu-lottery-bg__shape amu-lottery-bg__star animate-wiggle">
                        <span className="material-symbols-outlined">casino</span>
                    </div>
                </div>

                {!isGameStarted ? (
                    // 1. 입력 폼 화면
                    <div className="animate-fade-in max-w-lg mx-auto pb-24 relative">
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-2">주사위에 뭘 새길까요?</h2>
                            <p className="text-sm text-foreground-muted">결정할 항목들을 직접 입력하거나<br />마법사에게 추천을 받아보세요.</p>
                        </div>

                        {/* Recommendation Button */}
                        <button
                            onClick={handleAutoSuggest}
                            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-primary/10 border border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-glow"
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
                                placeholder="항목 입력 (예: 치킨)"
                                className="flex-1 bg-surface border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-accent-pink transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || options.length >= 8}
                                className="w-12 h-12 flex items-center justify-center bg-surface-hover border border-border rounded-xl text-foreground hover:text-accent-pink transition-colors disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>
                        </form>

                        {/* Options List */}
                        <div className="flex flex-col gap-2">
                            {options.map((opt, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl animate-scale-in">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-foreground-muted">{i + 1}</span>
                                        <span className="font-semibold text-foreground text-sm">{opt}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveOption(i)}
                                        title="삭제"
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
                                className="flex-[2] py-3 bg-gradient-to-r from-accent-pink to-orange-400 text-white rounded-xl font-bold shadow-glow disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                주사위 굴리러 가기
                            </button>
                        </div>
                    </div>
                ) : (
                    // 2. 새로운 네온 네이티브 주사위 게임 화면
                    <div className="flex flex-col items-center flex-1 w-full h-full pb-6 pt-2 relative z-10 px-2 overflow-y-auto">
                        {/* Status Header */}
                        <div className="w-full flex justify-between items-center px-2 mb-4">
                            <button
                                onClick={handleReset}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-foreground-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> 다시 입력
                            </button>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                {options.length}면 주사위 매핑
                            </span>
                        </div>

                        {/* Title Header */}
                        <h1 className="text-foreground tracking-tight text-[28px] font-extrabold leading-tight text-center mb-6">
                            누가 걸릴까?
                        </h1>

                        {/* Dice Visual Area */}
                        <div className="relative w-full aspect-square max-w-[280px] mb-8 group flex-shrink-0">
                            {/* Background Glow Effect */}
                            <div className={`absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-75 ${isRolling ? "animate-pulse" : ""}`}></div>

                            <div className="relative w-full h-full flex items-center justify-center gap-4">
                                {/* Single Die */}
                                <div className={`relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-surface-dark to-surface-darker border border-primary/50 rounded-3xl shadow-[0_0_20px_rgba(140,43,238,0.4)] flex items-center justify-center transition-all duration-300 ${isRolling ? "animate-spin blur-[2px] -rotate-180 scale-90" : "rotate-0 hover:rotate-6 hover:scale-105 cursor-pointer"}`} onClick={!isRolling && !result ? roll : undefined}>
                                    {/* Neon dot pattern for aesthetic */}
                                    <div className="grid grid-cols-3 gap-2 p-4 w-full h-full opacity-30">
                                        {[...Array(9)].map((_, idx) => (
                                            <div key={idx} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full place-self-center ${[0, 2, 4, 6, 8].includes(idx) ? 'bg-primary shadow-[0_0_8px_#8c2bee]' : 'bg-transparent'}`}></div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-lg">
                                        <span className="text-6xl font-black text-white drop-shadow-[0_0_15px_#8c2bee]">
                                            {diceNumber ?? "?"}
                                        </span>
                                    </div>
                                </div>

                                {/* Abstract Motion Blur trails */}
                                {isRolling && (
                                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                                        <div className="absolute top-4 left-10 w-2 h-20 bg-primary blur-md transform -rotate-45 animate-pulse"></div>
                                        <div className="absolute bottom-4 right-10 w-2 h-20 bg-primary blur-md transform rotate-45 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result Output / Current Sum (if result exists) */}
                        {result && !isRolling && (
                            <div className="flex w-full gap-3 mb-6 px-2 animate-fade-in-up">
                                <div className="flex-1 bg-surface-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-accent-pink text-xs font-medium mb-1">Total Roll</span>
                                    <span className="text-foreground font-bold text-xl">{diceNumber}</span>
                                </div>
                                <div className="flex-1 bg-surface-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(140,43,238,0.15)] overflow-hidden">
                                    <span className="text-accent text-xs font-medium mb-1">Winner</span>
                                    <span className="text-primary font-bold text-lg truncate w-full text-center">{result}</span>
                                </div>
                            </div>
                        )}

                        {/* Mapping List */}
                        <div className="w-full space-y-3 mb-8 px-2 flex-1">
                            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-accent font-bold px-2">
                                <span>Roll</span>
                                <span>Outcome</span>
                            </div>

                            {/* List Items Scrollable */}
                            <div className="space-y-2 pr-2">
                                {options.map((opt, i) => {
                                    const roleNum = i + 1;
                                    const isWinner = result !== null && !isRolling && (diceNumber === roleNum);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${isWinner ? 'bg-surface-dark border border-primary/50 shadow-[0_0_10px_rgba(140,43,238,0.2)] scale-105' : 'bg-surface-dark/40 border border-white/5 opacity-70'} ${isRolling ? 'opacity-40 grayscale animate-pulse' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isWinner ? 'bg-surface-darker text-primary' : 'bg-surface-darker text-accent/50'}`}>
                                                    {roleNum}
                                                </div>
                                                <span className={`${isWinner ? 'text-white font-bold' : 'text-slate-300'}`}>
                                                    {opt.length > 15 ? opt.slice(0, 15) + '...' : opt}
                                                </span>
                                            </div>
                                            {isWinner && (
                                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="sticky bottom-4 left-0 w-full flex flex-col items-center justify-center z-20 gap-3 mt-auto px-4">
                            {!result && !isRolling && (
                                <button
                                    onClick={roll}
                                    className="w-full max-w-[320px] bg-primary hover:bg-primary-light text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(140,43,238,0.4)] transform transition-transform active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined group-hover:animate-bounce">casino</span>
                                    SHAKE &amp; ROLL
                                </button>
                            )}

                            {result && !isRolling && (
                                <button
                                    onClick={handleRetry}
                                    className="w-full max-w-[320px] bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(140,43,238,0.2)] transform transition-colors active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={20} />
                                    같은 풀로 다시 던지기
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
