"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppLayout } from "@/components/layout/Header";
import type { User } from "@supabase/supabase-js";

const DECISION_TOOLS = [
  {
    href: "/decisions/grid",
    icon: "grid_view",
    title: "메뉴 추천표",
    desc: "직접 선택하며 좁혀가기",
    color: "#8c2bee",
    bgColor: "rgba(140, 43, 238, 0.15)",
  },
  {
    href: "/decisions/random",
    icon: "casino",
    title: "랜덤 선택",
    desc: "운에 맡기기",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
  },
  {
    href: "/decisions/spinwheel",
    icon: "target",
    title: "스핀휠",
    desc: "돌려돌려 돌림판",
    color: "var(--accent-pink)",
    bgColor: "var(--accent-pink-light)",
  },
  {
    href: "/decisions/dice",
    icon: "casino",
    title: "주사위",
    desc: "굴려서 결정",
    color: "var(--accent-cyan)",
    bgColor: "var(--accent-cyan-light)",
  },
  {
    href: "/decisions/lottery",
    icon: "confirmation_number",
    title: "제비뽑기",
    desc: "두근두근 제비뽑기",
    color: "#feca57",
    bgColor: "rgba(254, 202, 87, 0.15)",
  },
  {
    href: "/balance",
    icon: "balance",
    title: "밸런스게임",
    desc: "A vs B 당신의 선택은?",
    color: "var(--accent-pink)",
    bgColor: "var(--accent-pink-light)",
  },
  {
    href: "/decisions/dart",
    icon: "adjust",
    title: "다트 던지기",
    desc: "운명을 결정하는 한 방",
    color: "#ccff00",
    bgColor: "rgba(204, 255, 0, 0.15)",
  },
];

export default function HomePage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const nickname = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

  // 한국어 조사: 받침 있으면 "아", 없으면 "야"
  const getParticle = (name: string) => {
    if (!name) return "아";
    const lastChar = name.charCodeAt(name.length - 1);
    // 한글 유니코드 범위 (가 ~ 힣)
    if (lastChar < 0xAC00 || lastChar > 0xD7A3) return "아";
    return (lastChar - 0xAC00) % 28 > 0 ? "아" : "야";
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Floating Background Blobs */}
        <div className="amu-bg-blobs">
          <div className="amu-blob amu-blob--1 animate-float" />
          <div className="amu-blob amu-blob--2 animate-float-delay" />
          <div className="amu-blob amu-blob--3" />
        </div>

        {/* Hero */}
        <section className="amu-hero">
          <p className="amu-hero__greeting">
            {user ? `Hey! 👋` : "환영해요 👋"}
          </p>
          <h1 className="amu-hero__title">
            오늘 뭐 먹지?<br />
            <span className="gradient-text neon-text">
              {user ? `AMU거나 좀 먹어, ${nickname}${getParticle(nickname)}.` : "AMU거나 좀 먹어."}
            </span>
          </h1>
        </section>

        {/* Decision Tools Grid */}
        <section className="amu-section">
          <h2 className="amu-section__title">
            <span className="material-symbols-outlined amu-icon--primary">sports_esports</span>
            결정 도구
          </h2>
          <div className="amu-tools-grid">
            {DECISION_TOOLS.map((tool) => {
              const isLocked = !user;
              return (
                <Link
                  key={tool.href}
                  href={isLocked ? "/login" : tool.href}
                  className="amu-tool-card"
                >
                  {/* Glow blob */}
                  <div className="amu-tool-card__glow" style={{ background: tool.bgColor }} />

                  {/* Icon */}
                  <div
                    className="amu-tool-card__icon"
                    style={{ background: tool.bgColor, color: tool.color }}
                  >
                    <span className="material-symbols-outlined">{tool.icon}</span>
                  </div>

                  {/* Info */}
                  <span className="amu-tool-card__name">{tool.title}</span>
                  <p className="amu-tool-card__desc">{tool.desc}</p>

                  {/* Badges */}
                  {isLocked && (
                    <span className="amu-badge amu-badge--locked">🔒 로그인</span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Stats / Info */}
        {user && (
          <section className="amu-section">
            <h2 className="amu-section__title">
              <span className="material-symbols-outlined text-cyan-500">trending_up</span>
              내 기록
            </h2>
            <div className="amu-quick-links">
              <Link href="/history" className="amu-quick-link">
                <span className="material-symbols-outlined">history</span>
                히스토리
              </Link>
              <Link href="/favorites" className="amu-quick-link">
                <span className="material-symbols-outlined">favorite</span>
                즐겨찾기
              </Link>
              <Link href="/stats" className="amu-quick-link">
                <span className="material-symbols-outlined">bar_chart</span>
                통계
              </Link>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
