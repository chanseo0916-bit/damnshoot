"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Home,
    UtensilsCrossed,
    Shuffle,
    Heart,
    History,
    BarChart3,
    LogOut,
    Swords,
    User,
    Settings,
    Bell,
    ArrowLeft,
    Moon,
    Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// ============================================================
// Bottom Navigation Items
// ============================================================

const BOTTOM_NAV = [
    { href: "/", label: "홈", icon: Home },
    { href: "/decisions", label: "결정", icon: Shuffle },
    { href: "/profile", label: "프로필", icon: User },
];

// ============================================================
// Top Header (In-App)
// ============================================================

export function AppHeader({ title, showBack = false }: { title?: string; showBack?: boolean }) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="amu-header">
            <div className="amu-header__inner">
                {showBack ? (
                    <button
                        onClick={() => router.back()}
                        className="amu-header__btn"
                        aria-label="뒤로가기"
                    >
                        <ArrowLeft size={24} />
                    </button>
                ) : (
                    <div className="amu-header__spacer" />
                )}

                {title ? (
                    <h1 className="amu-header__title">{title}</h1>
                ) : (
                    <Link href="/" className="amu-header__logo">
                        AMU
                    </Link>
                )}

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="amu-header__btn ml-auto"
                    aria-label="테마 변경"
                >
                    {mounted ? (theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />) : <div className="w-6 h-6" />}
                </button>
            </div>
        </header>
    );
}

// ============================================================
// Bottom Navigation
// ============================================================

function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="amu-bottom-nav">
            <div className="amu-bottom-nav__inner">
                {BOTTOM_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "amu-bottom-nav__item",
                                isActive && "amu-bottom-nav__item--active"
                            )}
                        >
                            <div className="amu-bottom-nav__icon-wrap">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
                                {isActive && <span className="amu-bottom-nav__dot" />}
                            </div>
                            <span className="amu-bottom-nav__label">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// ============================================================
// AppLayout — Mobile-first with Bottom Navigation
// ============================================================

export function AppLayout({ children, title, showBack }: {
    children: React.ReactNode;
    title?: string;
    showBack?: boolean;
}) {
    return (
        <div className="amu-app-shell">
            <AppHeader title={title} showBack={showBack} />
            <main className="amu-main no-scrollbar">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}

// Keep old export name for backward compat
export { AppLayout as Header };
