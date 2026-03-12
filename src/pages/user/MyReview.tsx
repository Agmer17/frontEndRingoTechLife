import { useEffect, useState } from "react";
import { Star, Clock, User, Pencil, Trash2 } from "lucide-react";
import StarRatingInput from "../../components/shared/StarRatingInput";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import ConfirmDialog from "../../components/shared/ConfirmModal";
import { useAccountReview } from "../../hooks/account/useAccountReview";
import UpdateReviewModal from "../../components/shared/UpdateReviewModal";
import type { UpdateReviewRequest } from "../../types/review";

export default function ReviewsPage() {
    const { reviews, loading, fetchMyReview, updateMyReview, deleteMyReview } = useAccountReview();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        rating: 0,
        comment: "",
    });

    const { toast, showToast, dismissToast } = useToast();



    useEffect(() => {
        const fetchReview = async () => {
            await fetchMyReview()
        }

        fetchReview()
    }, [])


    if (loading) return <p className="p-6">Loading reviews...</p>;

    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;

        const res = await deleteMyReview(reviewToDelete);

        if (res.success) {
            setShowDeleteDialog(false);
            setReviewToDelete(null);

            showToast("success", res.message)
            await fetchMyReview()
        } else {
            if (typeof res.error == "string") {
                showToast("error", res.error || "gagal menghapus review")
            } else if (typeof res.error == "object") {
                showToast("error", res.error || "gagal menghapus review")
            }
        }
    };

    const handleUpdate = async (reviewData: UpdateReviewRequest, id: string) => {
        if (!selectedReview) return;
        const res = await updateMyReview(reviewData, id);

        if (res.success) {
            setSelectedReview(null);
            showToast("success", res.message)
            await fetchMyReview()
        } else {
            if (typeof res.error == "string") {
                showToast("error", res.error || "gagal mengupdate review")
            } else if (typeof res.error == "object") {
                showToast("error", res.error || "gagal mengupdate review")
            }
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <div className="text-center flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold">
                        Belum ada review
                    </p>
                    <p className="text-sm text-base-content/60">
                        Kamu belum memberikan review pada produk manapun.
                    </p>
                </div>
            </div>
        )
    }
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">
                Review Kamu
            </h1>

            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="update Berhasil!"
                errorTitle="update Gagal"
            />

            {reviews.map((review) => (
                <div
                    key={review.review_id}
                    className="border border-black rounded-xl p-4 bg-base-100 relative"
                >

                    {/* ACTION BUTTONS */}
                    <div className="absolute top-3 right-3 flex gap-1">
                        <button
                            className="p-2 rounded-lg text-warning hover:bg-warning/10 transition-colors"
                            onClick={() => {
                                setSelectedReview(review);
                                setEditForm({
                                    rating: review.review_rating,
                                    comment: review.review_comment,
                                });
                            }}
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                            onClick={() => {
                                setReviewToDelete(review.review_id);
                                setShowDeleteDialog(true);
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* HEADER */}
                    <div className="flex items-start gap-3">

                        {/* AVATAR */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
                            {review.user.user_profile_picture ? (
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/user/${review.user.user_profile_picture}`}
                                    alt={review.user.user_fullname}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <User size={18} className="opacity-60" />
                            )}
                        </div>

                        {/* USER + RATING */}
                        <div className="flex-1 min-w-0">

                            {/* NAME */}
                            <p className="font-medium text-sm leading-none">
                                {review.user.user_fullname}
                            </p>

                            {/* STAR + DATE */}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">

                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            size={16}
                                            className={
                                                index < review.review_rating
                                                    ? "fill-warning text-warning"
                                                    : "opacity-30"
                                            }
                                        />
                                    ))}
                                </div>

                                <span className="opacity-60 flex items-center gap-1 text-xs">
                                    <Clock size={13} />
                                    {new Date(review.review_created_at).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>

                            {/* COMMENT */}
                            <p className="mt-3 text-sm leading-relaxed">
                                {review.review_comment}
                            </p>

                            {/* PRODUCT */}
                            <div className="mt-4 pt-3 border-t border-black flex gap-3 items-center">

                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-base-200 shrink-0">
                                    {review.product_thumbnail ? (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGE_URL}/products/${review.product_thumbnail}`}
                                            alt={review.product_name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : null}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs opacity-60">
                                        Produk yang direview
                                    </p>

                                    <p className="font-medium text-sm truncate">
                                        {review.product_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {showDeleteDialog && (
                <ConfirmDialog
                    open={showDeleteDialog}
                    title="hapus review"
                    message="Review Yang dihapus tidak dapat dikembalikan!"
                    confirmText="Hapus"
                    variant="error"
                    loading={loading}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}

            {selectedReview && (
                <UpdateReviewModal
                    review={selectedReview}
                    loading={loading}
                    onClose={() => { selectedReview(null) }}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
}