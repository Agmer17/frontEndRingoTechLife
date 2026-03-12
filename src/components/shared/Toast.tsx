import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error";

export interface ToastState {
    type: ToastType;
    message: string | Record<string, string>;
}


interface ToastProps {
    toast: ToastState | null;
    onDismiss: () => void;
    successTitle?: string;
    errorTitle?: string;
    duration?: number;
}

export function Toast({
    toast,
    onDismiss,
    successTitle = "Berhasil!",
    errorTitle = "Terjadi Kesalahan",
    duration = 500,
}: ToastProps) {
    const isSuccess = toast?.type === "success";

    return (
        <AnimatePresence mode="wait">
            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <motion.div
                        key="toast-body"
                        initial={{ opacity: 0, y: -16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className={`relative alert shadow-xl max-w-xs sm:max-w-sm backdrop-blur-sm ${isSuccess
                            ? "alert-success border border-success/30"
                            : "alert-error border border-error/30"
                            }`}
                    >
                        {/* Icon */}
                        <span className="shrink-0">
                            {isSuccess ? (
                                <CheckCircle2
                                    size={20}
                                    className="text-success-content"
                                />
                            ) : (
                                <AlertCircle
                                    size={20}
                                    className="text-error-content"
                                />
                            )}
                        </span>

                        {/* Content */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <span
                                className={`font-semibold text-sm ${isSuccess
                                    ? "text-success-content"
                                    : "text-error-content"
                                    }`}
                            >
                                {isSuccess ? successTitle : errorTitle}
                            </span>

                            {typeof toast.message === "string" ? (
                                <span
                                    className={`text-xs mt-0.5 leading-relaxed ${isSuccess
                                        ? "text-success-content"
                                        : "text-error-content"
                                        }`}
                                >
                                    {toast.message}
                                </span>
                            ) : (
                                <ul className="mt-1 space-y-0.5">
                                    {Object.entries(toast.message).map(
                                        ([field, msg]) => (
                                            <li
                                                key={field}
                                                className="text-xs flex items-start gap-1 text-error-content"
                                            >
                                                <span className="mt-0.5 shrink-0">•</span>
                                                <span>
                                                    <strong className="font-medium">
                                                        {field}:
                                                    </strong>{" "}
                                                    {msg}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Close Button (error only) */}
                        {!isSuccess && (
                            <button
                                onClick={onDismiss}
                                className="btn btn-xs btn-ghost btn-circle text-error-content hover:bg-error/10 transition"
                                aria-label="Tutup"
                            >
                                <X size={16} />
                            </button>
                        )}

                        {/* Progress Bar */}
                        {isSuccess && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-success/20 overflow-hidden rounded-b-lg">
                                <motion.div
                                    className="h-full bg-success"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{
                                        duration: duration / 1000,
                                        ease: "linear",
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}