import { normalizeApiError } from "../lib/normalizeApiError";

export function handleApiError(error: unknown) {
    const apiError = normalizeApiError(error);

    if (apiError.type === "general") {
        return {
            success: false as const,
            error: apiError.message,
        };
    }

    if (apiError.type === "validation") {
        return {
            success: false as const,
            error: apiError.fieldErrors,
        };
    }

    return {
        success: false as const,
        error: "Terjadi kesalahan yang tidak diketahui",
    };
}