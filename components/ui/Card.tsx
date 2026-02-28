"use client";

import { cn } from "@/lib/utils";

// ============================================================
// Card
// ============================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "highlight";
    hoverable?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

function Card({
    className,
    variant = "default",
    hoverable = false,
    padding = "md",
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "ds-card",
                `ds-card--${variant}`,
                `ds-card--pad-${padding}`,
                hoverable && "ds-card--hoverable",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// ============================================================
// Card Sub-components
// ============================================================

function CardHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("ds-card__header", className)} {...props}>
            {children}
        </div>
    );
}

function CardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn("ds-card__title", className)} {...props}>
            {children}
        </h3>
    );
}

function CardContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("ds-card__content", className)} {...props}>
            {children}
        </div>
    );
}

function CardFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("ds-card__footer", className)} {...props}>
            {children}
        </div>
    );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
export type { CardProps };
