"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            toast("warning", "모든 필드를 입력해주세요.");
            return;
        }
        if (password.length < 6) {
            toast("warning", "비밀번호는 6자 이상이어야 합니다.");
            return;
        }
        if (password !== confirmPassword) {
            toast("error", "비밀번호가 일치하지 않습니다.");
            return;
        }
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: nickname || email.split("@")[0] } },
        });
        if (error) {
            toast("error", "회원가입 실패: " + error.message);
            setIsLoading(false);
            return;
        }
        toast("success", "회원가입 완료! 🎉");
        router.push("/");
        router.refresh();
    };

    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) toast("error", "Google 회원가입 실패: " + error.message);
    };

    return (
        <div className="amu-auth-shell font-display">
            {/* Header Section */}
            <div className="amu-auth-header pt-10 px-6 pb-6">
                <div className="amu-auth-logo-wrap group mb-4">
                    <div className="amu-auth-logo-glow" />
                    <div className="amu-auth-logo-icon">
                        <span className="material-symbols-outlined">restaurant_menu</span>
                    </div>
                </div>
                <h1 className="amu-auth-title text-[40px]">회원가입</h1>
                <p className="amu-auth-subtitle text-base">
                    가입하고 결정장애 탈출하자!
                </p>
            </div>

            {/* Form Section */}
            <div className="amu-auth-form-wrap">
                {/* Google Button */}
                <button
                    className="amu-btn-google group"
                    onClick={handleGoogleSignup}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span>Sign up with Google</span>
                </button>

                {/* Divider */}
                <div className="amu-auth-divider">
                    <span>Or sign up with Email</span>
                </div>

                {/* Email Form */}
                <form className="amu-auth-form" onSubmit={handleRegister}>
                    <label className="amu-input-label">
                        <span className="amu-input-title">Nickname (Optional)</span>
                        <div className="amu-input-wrap">
                            <span className="material-symbols-outlined amu-input-icon">person</span>
                            <input
                                className="amu-input"
                                type="text"
                                placeholder="Enter nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                    </label>

                    <label className="amu-input-label">
                        <span className="amu-input-title">Email Address</span>
                        <div className="amu-input-wrap">
                            <span className="material-symbols-outlined amu-input-icon">mail</span>
                            <input
                                className="amu-input"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </label>

                    <label className="amu-input-label">
                        <span className="amu-input-title">Password</span>
                        <div className="amu-input-wrap">
                            <span className="material-symbols-outlined amu-input-icon">lock</span>
                            <input
                                className="amu-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="6+ characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="amu-input-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </label>

                    <label className="amu-input-label">
                        <span className="amu-input-title">Confirm Password</span>
                        <div className="amu-input-wrap">
                            <span className="material-symbols-outlined amu-input-icon">lock</span>
                            <input
                                className="amu-input"
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <span className="amu-input-error">비밀번호가 일치하지 않습니다</span>
                        )}
                    </label>

                    <button
                        type="submit"
                        className="amu-btn-submit group"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="amu-spinner" />
                        ) : (
                            <>
                                Sign Up
                                <span className="material-symbols-outlined">person_add</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="amu-auth-footer justify-center gap-2">
                    <span className="amu-auth-link">Already have an account?</span>
                    <Link href="/login" className="amu-auth-link-highlight">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
