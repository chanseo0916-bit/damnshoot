import { cn } from "@/lib/utils";

// ============================================================
// Skeleton
// ============================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    rounded?: "sm" | "md" | "lg" | "full";
}

function Skeleton({
    className,
    width,
    height,
    rounded = "md",
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "bg-surface-darker animate-pulse",
                `rounded-${rounded}`,
                className
            )}
            style={{ width, height, ...style }}
            {...props}
        />
    );
}

export { Skeleton };
export type { SkeletonProps };
