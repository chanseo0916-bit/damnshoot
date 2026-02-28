"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Modal
// ============================================================

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    className?: string;
}

function Modal({
    isOpen,
    onClose,
    title,
    size = "md",
    children,
    className,
}: ModalProps) {
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEsc]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="ds-modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn("ds-modal", `ds-modal--${size}`, className)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <div className="ds-modal__header">
                                <h2 className="ds-modal__title">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="ds-modal__close"
                                    aria-label="닫기"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        <div className="ds-modal__body">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export { Modal };
export type { ModalProps };
