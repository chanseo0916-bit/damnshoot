"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ============================================================
// Button
// ============================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn("ds-button", `ds-button--${variant}`, `ds-button--${size}`, className)}
                {...props}
            >
                {isLoading && <span className="ds-button__spinner" />}
                {!isLoading && leftIcon && (
                    <span className="ds-button__icon">{leftIcon}</span>
                )}
                <span>{children}</span>
                {!isLoading && rightIcon && (
                    <span className="ds-button__icon">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
