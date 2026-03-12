import { useState } from "react";
import axiosInstance from "../../lib/axios";
import { handleApiError } from "../../utils/errorUtils";

export function useDeleteMyReview() {
    const [loading, setLoading] = useState(false);

    const deleteReview = async (reviewId: string) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/reviews/delete-my-review/${reviewId}`);
            return { success: true as const, message: "berhasil menghapus review" };
        } catch (error: any) {
            return handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    return { deleteReview, loading };
}