"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Wand2, Plus, X } from "lucide-react";
import { AppLayout } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { useAddHistory } from "@/hooks/useHistory";
import { getRandomMenus } from "@/lib/decisions";

const COLORS = ["#6c5ce7", "#00cec9", "#e17055", "#0984e3", "#fdcb6e", "#e84393", "#00b894", "#d63031"];

export default function SpinWheelPage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isGameStarted, setIsGameStarted] = useState(false);

    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const animRef = useRef<number>(0);

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
            toast("warning", "최대 8개까지만 추가 가능합니다.");
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
        setRotation(0);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            toast("warning", "최소 2개 이상의 항목이 필요합니다.");
            return;
        }
        setIsGameStarted(true);
        setResult(null);
        setRotation(0); // 캔버스 초기화용
    };

    // --- Spinwheel Section ---

    const drawWheel = useCallback(
        (rot: number) => {
            const canvas = canvasRef.current;
            if (!canvas || !isGameStarted || options.length === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const size = canvas.width;
            const center = size / 2;
            const radius = center - 4;
            const sliceAngle = (2 * Math.PI) / options.length;

            ctx.clearRect(0, 0, size, size);
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(rot);

            options.forEach((opt, i) => {
                const start = i * sliceAngle;
                const end = start + sliceAngle;
                const color = COLORS[i % COLORS.length];

                // Slice
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, start, end);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Text
                ctx.save();
                ctx.rotate(start + sliceAngle / 2);
                ctx.fillStyle = "#fff";
                ctx.font = `bold ${Math.min(14, 140 / options.length)}px system-ui`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const textRadius = radius * 0.65;
                const nameStr = opt.length > 5 ? opt.slice(0, 4) + ".." : opt;
                ctx.fillText(nameStr, textRadius, 0);
                ctx.restore();
            });

            ctx.restore();
        },
        [options, isGameStarted]
    );

    useEffect(() => {
        if (isGameStarted) {
            drawWheel(rotation);
        }
    }, [drawWheel, rotation, isGameStarted]);

    const spin = () => {
        if (options.length === 0) return;
        setResult(null);
        setIsSpinning(true);

        const spins = Math.floor(5 + Math.random() * 5); // 5~10 바퀴 (정수)
        const duration = 4000;
        const startTime = Date.now();
        const startRot = rotation;

        // 당첨 인덱스 계산을 위해, 빙글빙글 돌다 정지할 각도를 계산합니다
        // 상단 포인터(270도 위치, 즉 -Math.PI/2)를 기준으로 삼습니다.
        // 역방향 회전을 고려해 sliceAngle로 나눕니다.
        const sliceAngle = (2 * Math.PI) / options.length;

        // 미리 당첨결과를 하나 정해서 그곳으로 멈추게 하는 방식
        const winnerIndex = Math.floor(Math.random() * options.length);

        // i번째 요소의 중앙 각도는 i * sliceAngle + sliceAngle/2 입니다.
        // 이것이 하늘(-Math.PI/2)에 오려면: element_center + rotation = -Math.PI/2 (또는 동등한 각도)
        // rotation = -Math.PI/2 - element_center
        const targetElementCenterRotation = - (Math.PI / 2) - (winnerIndex * sliceAngle + sliceAngle / 2);

        // 여러 바퀴(spins) 더 돌기 (항상 양의 방향으로 돌림)
        // 현재 각도 startRot에서 targetElementCenterRotation에 도달할 때까지 오른쪽(시계방향)으로 얼마나 가야 하는지 최소 회전량을 구합니다.
        let normalizedTarget = targetElementCenterRotation % (Math.PI * 2);
        if (normalizedTarget < 0) normalizedTarget += Math.PI * 2;

        let normalizedStart = startRot % (Math.PI * 2);
        if (normalizedStart < 0) normalizedStart += Math.PI * 2;

        let diff = normalizedTarget - normalizedStart;
        if (diff < 0) diff += Math.PI * 2;

        // 최종 회전 목표: 현재 각도 + (바퀴 수 * 일주 각도) + 추가 회전 각도
        const totalTargetRotation = startRot + spins * Math.PI * 2 + diff;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentRot = startRot + (totalTargetRotation - startRot) * eased;

            setRotation(currentRot);

            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                setRotation(totalTargetRotation % (Math.PI * 2)); // 정규화
                setResult(options[winnerIndex]);
                toast("success", `🎉 ${options[winnerIndex]} 당첨!`);
                addHistory({
                    foodId: "", // 자체 메뉴
                    foodName: options[winnerIndex],
                    method: "spinwheel",
                });
            }
        };

        animRef.current = requestAnimationFrame(animate);
    };

    // Retry (다시 돌리기)
    const handleRetry = () => {
        setResult(null);
        spin();
    };

    useEffect(() => {
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <AppLayout title="룰렛 돌리기" showBack>
            <div className={`amu-lottery-page animate-fade-in ${!isGameStarted ? "p-4" : ""}`}>

                {/* Background Effects */}
                <div className="amu-lottery-bg">
                    <div className="amu-blob amu-blob--1 animate-float" />
                    <div className="amu-blob amu-blob--2 animate-float-delay" />
                    <div className="amu-lottery-bg__shape amu-lottery-bg__circle animate-wiggle">
                        <span className="material-symbols-outlined">data_usage</span>
                    </div>
                </div>

                {!isGameStarted ? (
                    // 1. 입력 폼 화면 (제비뽑기와 동일 디자인)
                    <div className="relative z-10 flex flex-col gap-6 max-w-sm mx-auto w-full pt-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-2">룰렛에 무엇을 넣을까요?</h2>
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
                                placeholder="항목 입력 (예: 돈까스)"
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
                                className="flex-[2] py-3 bg-gradient-to-r from-primary to-accent-pink text-white rounded-xl font-bold shadow-glow disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                룰렛 돌리러 가기
                            </button>
                        </div>
                    </div>
                ) : (
                    // 2. 룰렛 게임 화면
                    <div className="flex flex-col items-center flex-1 w-full h-full pb-6 pt-2 relative z-10">
                        {/* Status Header */}
                        <div className="w-full flex justify-between items-center px-4 mb-8">
                            <button
                                onClick={handleReset}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-foreground-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> 다시 입력
                            </button>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                총 {options.length}칸
                            </span>
                        </div>

                        <div className="amu-lottery-bubble mt-0 mb-8">
                            <p className="gradient-text text-center text-orange-400 font-bold text-lg m-0">
                                {isSpinning ? "돌아갑니다~ 🌀" : result ? `🎉 ${result} 당첨!` : "버튼을 눌러 돌려보세요!"}
                            </p>
                        </div>

                        {/* Spinwheel Canvas */}
                        <div className="spinwheel-container relative mb-12" style={{ transform: isSpinning ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.3s ease' }}>
                            <div className="spinwheel-pointer" style={{ fontSize: '32px', top: '-24px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>▼</div>
                            <canvas
                                ref={canvasRef}
                                width={300}
                                height={300}
                                className="spinwheel-canvas rounded-full shadow-glow border-4 border-surface"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-center gap-4 mt-auto w-full px-6">
                            {!result && !isSpinning && (
                                <button
                                    className="amu-cta amu-cta--primary w-full py-4 rounded-xl flex items-center justify-center gap-2 shadow-glow font-bold text-lg hover:scale-105 transition-transform"
                                    onClick={spin}
                                >
                                    <RefreshCw size={22} className="animate-spin-slow" />
                                    돌리기 시작!
                                </button>
                            )}

                            {result && !isSpinning && (
                                <div className="w-full flex flex-col gap-3 animate-fade-in-up">
                                    <button
                                        onClick={handleRetry}
                                        className="w-full py-4 bg-surface border-2 border-primary text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <RefreshCw size={20} />
                                        같은 후보로 다시 돌리기
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
