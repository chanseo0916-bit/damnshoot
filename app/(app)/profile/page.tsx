"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AppLayout } from "@/components/layout/Header";
import { LogOut, User, Mail, Award, ArrowRight, Pencil, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    // 닉네임 수정 상태
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState("");
    const [editValue, setEditValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data?.user) {
                router.push("/login");
                return;
            }
            setUser(data.user);
            const name = data.user.user_metadata?.display_name || data.user.email?.split("@")[0] || "유저";
            setNickname(name);
            setEditValue(name);
            setLoading(false);

            // 히스토리 개수
            const { count } = await supabase
                .from("decision_history")
                .select("*", { count: "exact", head: true })
                .eq("user_id", data.user.id);
            setHistoryCount(count || 0);
        };
        loadUser();
    }, [supabase, router]);

    const handleSaveNickname = async () => {
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === nickname) {
            setIsEditing(false);
            setEditValue(nickname);
            return;
        }
        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { display_name: trimmed },
        });
        setSaving(false);
        if (!error) {
            setNickname(trimmed);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValue(nickname);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <AppLayout title="프로필" showBack>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="프로필" showBack>
            <div className="p-6 pb-24">
                {/* Profile Header */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center mb-4 shadow-glow">
                        <User size={40} className="text-white" />
                    </div>

                    {/* 닉네임 영역 (편집 가능) */}
                    {isEditing ? (
                        <div className="flex items-center gap-2 mb-1">
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveNickname();
                                    if (e.key === "Escape") handleCancelEdit();
                                }}
                                maxLength={20}
                                autoFocus
                                className="bg-surface border-2 border-primary rounded-xl px-4 py-2 text-xl font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
                            />
                            <button
                                onClick={handleSaveNickname}
                                disabled={saving}
                                title="저장"
                                className="p-2 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                title="취소"
                                className="p-2 rounded-full bg-surface border border-border text-foreground-muted hover:text-danger hover:border-danger transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 mb-1 group"
                        >
                            <h1 className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                                {nickname}
                            </h1>
                            <Pencil size={16} className="text-foreground-muted group-hover:text-primary transition-colors" />
                        </button>
                    )}

                    <div className="flex items-center gap-2 text-foreground-muted text-sm">
                        <Mail size={14} />
                        <span>{user?.email}</span>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="ds-card ds-card--default p-4 flex flex-col items-center justify-center text-center">
                        <Award className="text-primary mb-2" size={28} />
                        <span className="text-xs text-foreground-muted font-medium uppercase">결정 완료</span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {historyCount}<span className="text-sm font-normal text-foreground-muted ml-1">회</span>
                        </span>
                    </div>
                    <Link href="/history" className="ds-card ds-card--default p-4 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group">
                        <div className="flex items-center justify-center gap-2 text-primary mb-2">
                            <span className="material-symbols-outlined text-[28px]">history</span>
                        </div>
                        <span className="text-xs text-foreground-muted font-medium uppercase transition-colors group-hover:text-primary">히스토리 보기</span>
                        <div className="mt-1 flex items-center text-primary text-sm font-bold">
                            이동하기 <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                </div>

                {/* Settings / Actions List */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-wider pl-2 mb-2">계정 설정</h3>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full ds-card ds-card--default p-4 flex items-center justify-between hover:border-primary transition-colors text-left group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <Pencil size={18} />
                            </div>
                            <span className="font-semibold text-foreground">닉네임 수정</span>
                        </div>
                        <ArrowRight size={18} className="text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </button>

                    <div className="mb-4"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-danger/30 text-danger bg-danger/5 hover:bg-danger hover:text-white transition-all font-bold"
                    >
                        <LogOut size={20} />
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
