"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ============================================================
// Select
// ============================================================

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s/g, "-");
        return (
            <div className="ds-input-wrapper">
                {label && (
                    <label htmlFor={selectId} className="ds-input-label">
                        {label}
                    </label>
                )}
                <div className={cn("ds-input-container", error && "ds-input-container--error")}>
                    <select
                        ref={ref}
                        id={selectId}
                        className={cn("ds-input ds-select", className)}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p className="ds-input-error">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
export { Select };
export type { SelectProps, SelectOption };
