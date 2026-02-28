"use client";

import { useState, useEffect } from "react";

const TIMEOUT_MS = 5 * 60 * 1000; // 5분

export default function IdlePopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, TIMEOUT_MS);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Popup */}
            <div className="relative w-full max-w-sm rounded-3xl border-2 border-danger bg-surface p-8 text-center shadow-[0_0_60px_rgba(255,107,107,0.4)] animate-[resultPop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
                {/* Emoji */}
                <div className="text-7xl mb-4">😤</div>

                {/* Title */}
                <h2 className="text-2xl font-display font-black text-danger mb-2 leading-tight">
                    야 그냥 밥 먹지마
                </h2>
                <p className="text-3xl font-display font-black text-foreground mb-6">
                    넌 안되겠다
                </p>

                {/* Subtitle */}
                <p className="text-sm text-foreground-muted mb-8">
                    벌써 5분째 고민 중이야...<br />
                    그냥 아무거나 눌러!
                </p>

                {/* Button */}
                <button
                    onClick={() => setShow(false)}
                    className="amu-cta amu-cta--primary w-full text-base"
                >
                    😅 좀 더 생각하기
                </button>
            </div>
        </div>
    );
}
