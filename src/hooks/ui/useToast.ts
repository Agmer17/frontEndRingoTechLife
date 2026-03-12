import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastState, ToastType } from "../../components/shared/Toast";

interface ShowToastOptions {
    duration?: number;
    onSuccess?: () => void;
}

interface UseToastReturn {
    toast: ToastState | null;
    shakeKey: number;
    showToast: (type: ToastType, message: ToastState["message"], options?: ShowToastOptions) => void;
    dismissToast: () => void;
}

export function useToast(): UseToastReturn {
    const [toast, setToast] = useState<ToastState | null>(null);
    const [shakeKey, setShakeKey] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dismissToast = useCallback(() => setToast(null), []);

    const showToast = useCallback((
        type: ToastType,
        message: ToastState["message"],
        options: ShowToastOptions = {}
    ) => {
        const { duration = 700, onSuccess } = options;

        if (timerRef.current) clearTimeout(timerRef.current);

        setToast({ type, message });

        if (type === "error") {
            setShakeKey(k => k + 1);
        }

        if (type === "success") {
            timerRef.current = setTimeout(() => {
                setToast(null);
                onSuccess?.();
            }, duration);
        }
    }, []);

    // Cleanup timer on unmount
    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    return { toast, shakeKey, showToast, dismissToast };
}