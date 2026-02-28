"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { PRESET_MENUS } from "@/lib/decisions";

export default function RandomPickerPage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [displayIndex, setDisplayIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const spin = useCallback(() => {
        setResult(null);
        setIsSpinning(true);

        let speed = 20;
        let count = 0;
        const totalSteps = 30 + Math.floor(Math.random() * 20);
        const finalIndex = Math.floor(Math.random() * PRESET_MENUS.length);

        const tick = () => {
            setDisplayIndex(Math.floor(Math.random() * PRESET_MENUS.length));
            count++;

            if (count >= totalSteps) {
                setDisplayIndex(finalIndex);
                setResult(PRESET_MENUS[finalIndex]);
                setIsSpinning(false);
                toast("success", `🎉 ${PRESET_MENUS[finalIndex]} 당첨!`);
                addHistory({
                    foodId: "", // 자체 메뉴
                    foodName: PRESET_MENUS[finalIndex],
                    method: "random",
                });
                return;
            }

            // 점점 느려지기
            speed = 20 + (count / totalSteps) * 200;
            intervalRef.current = setTimeout(tick, speed);
        };

        intervalRef.current = setTimeout(tick, speed);
    }, [toast, addHistory]);

    // Retry (다시 뽑기)
    const handleRetry = () => {
        setResult(null);
        spin();
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 최초의 한 번은 랜덤한 단어를 보여주기 위함
        setDisplayIndex(Math.floor(Math.random() * PRESET_MENUS.length));
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, []);

    const currentName = PRESET_MENUS[displayIndex];

    return (
        <AppLayout title="무작위 1개 뽑기" showBack>
            <div className={`amu-lottery-page animate-fade-in`}>

                {/* Background Effects */}
                <div className="amu-lottery-bg">
                    <div className="amu-blob amu-blob--1 animate-float" style={{ background: 'var(--accent-cyan)' }} />
                    <div className="amu-blob amu-blob--2 animate-float-delay" style={{ background: 'var(--primary)' }} />
                    <div className="amu-lottery-bg__shape amu-lottery-bg__circle animate-wiggle">
                        <span className="material-symbols-outlined">shuffle</span>
                    </div>
                </div>

                <div className="flex flex-col items-center flex-1 w-full h-full pb-6 pt-12 relative z-10">
                    <div className="w-full flex justify-between items-center px-4 mb-8">
                        <div></div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                            총 {PRESET_MENUS.length}개 메뉴 대기 중
                        </span>
                    </div>

                    <div className="amu-lottery-bubble mt-0 mb-8">
                        <p className="gradient-text text-center text-cyan-400" style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
                            {isSpinning ? "운에 맡겨보세요! 🎰" : result ? `🎉 ${result} 당첨!` : "버튼을 눌러 뽑아보세요!"}
                        </p>
                    </div>

                    {/* Slot Machine Display */}
                    <div className={`w-full max-w-[260px] h-32 rounded-3xl border-4 ${isSpinning ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]" : "border-surface shadow-glow"} bg-background-dark flex items-center justify-center overflow-hidden relative transition-all mx-auto mb-12`}>
                        <div className="w-full absolute h-full bg-gradient-to-b from-background-dark via-transparent to-background-dark z-10 pointer-events-none opacity-60"></div>

                        <div className={`text-3xl font-bold ${isSpinning ? "text-cyan-400 blur-[1px]" : "text-white gradient-text"} transition-all`} style={{ transform: isSpinning ? "scale(1.1)" : "scale(1)" }}>
                            {currentName || "?"}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4 mt-auto w-full px-6">
                        {!result && !isSpinning && (
                            <button
                                className="amu-cta bg-gradient-to-r from-cyan-500 to-blue-500 w-full py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.4)] text-white font-bold text-lg hover:scale-105 transition-transform"
                                onClick={spin}
                            >
                                <RefreshCw size={22} className={isSpinning ? "animate-spin-slow" : ""} />
                                슬롯머신 돌리기!
                            </button>
                        )}

                        {result && !isSpinning && (
                            <div className="w-full flex flex-col gap-3 animate-fade-in-up">
                                <button
                                    onClick={handleRetry}
                                    className="w-full py-4 bg-surface border-2 border-cyan-500 text-cyan-400 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow hover:bg-cyan-500 hover:text-white transition-colors"
                                >
                                    <RefreshCw size={20} />
                                    다시 뽑기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
