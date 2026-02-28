"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ============================================================
// Input
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
        return (
            <div className="ds-input-wrapper">
                {label && (
                    <label htmlFor={inputId} className="ds-input-label">
                        {label}
                    </label>
                )}
                <div className={cn("ds-input-container", error && "ds-input-container--error")}>
                    {leftIcon && <span className="ds-input-icon">{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn("ds-input", leftIcon && "ds-input--with-icon", className)}
                        {...props}
                    />
                </div>
                {error && <p className="ds-input-error">{error}</p>}
                {hint && !error && <p className="ds-input-hint">{hint}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
export { Input };
export type { InputProps };
