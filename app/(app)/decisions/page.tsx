"use client";

import Link from "next/link";
import {
    Shuffle,
    Dices,
    Ticket,
    SlidersHorizontal,
    ArrowRight,
    Target,
} from "lucide-react";
import { AppLayout } from "@/components/layout/Header";

const TOOLS = [
    {
        href: "/decisions/random",
        icon: Shuffle,
        title: "랜덤 선택",
        desc: "슬롯머신처럼 돌려서 결정!",
        color: "#6c5ce7",
    },
    {
        href: "/decisions/spinwheel",
        icon: Target,
        title: "스핀휠",
        desc: "돌려돌려 돌림판!",
        color: "#00cec9",
    },
    {
        href: "/decisions/dice",
        icon: Dices,
        title: "주사위",
        desc: "운에 맡겨보자!",
        color: "#e17055",
    },
    {
        href: "/decisions/lottery",
        icon: Ticket,
        title: "제비뽑기",
        desc: "두근두근 하나씩 열기!",
        color: "#fdcb6e",
    },
    {
        href: "/decisions/filter",
        icon: SlidersHorizontal,
        title: "조건 필터",
        desc: "조건으로 좁혀서 결정!",
        color: "#0984e3",
    },
];

export default function DecisionsPage() {
    return (
        <AppLayout>
            <div className="animate-fade-in">
                <div className="ds-page-header">
                    <h1 className="ds-page-header__title">🎮 결정 도구</h1>
                    <p className="ds-page-header__subtitle">
                        다양한 방법으로 오늘의 메뉴를 결정해보세요
                    </p>
                </div>

                <div className="decision-hub-grid">
                    {TOOLS.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="decision-hub-card"
                            >
                                <div
                                    className="decision-hub-card__icon"
                                    style={{
                                        background: `${tool.color}18`,
                                    }}
                                >
                                    <Icon size={24} color={tool.color} />
                                </div>
                                <div className="decision-hub-card__info">
                                    <h3>{tool.title}</h3>
                                    <p>{tool.desc}</p>
                                </div>
                                <ArrowRight
                                    size={16}
                                    color="var(--foreground-muted)"
                                    style={{ marginLeft: "auto" }}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
