import { useEffect, useState } from "react"
import type { Review, UpdateReviewRequest } from "../../types/review"
import { useReviews } from "../../hooks/review/useReviews"
import { Pencil, Star, Trash2, UserIcon } from "lucide-react"
import { Toast } from "../../components/shared/Toast"
import { useToast } from "../../hooks/ui/useToast"
import UpdateReviewModal from "../../components/shared/UpdateReviewModal"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"

export default function AdminReviewPage() {


    const [listReviews, setListReviews] = useState<Review[]>([])
    const { getAllReview, editReview, deleteReview } = useReviews()
    const { toast, dismissToast, showToast } = useToast();
    const currentUserId = useSelector((state: RootState) => state.auth.id)
    const renderStars = (rating: number, size = 16) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                />
            ))}
        </div>
    )

    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [editFormReview, setEditFormReview] = useState(false)


    const onDeleteReview = async (review: Review) => {
        const resp = await deleteReview(review.review_id)

        if (resp.success) {
            showToast("success", resp.message)
        } else {
            showToast("error", resp.error)
        }
    }

    const onEditReview = async (newData: UpdateReviewRequest, id: string) => {

        const res = await editReview(newData, id)

        if (res.success) {
            showToast("success", res.message)
        } else {
            showToast("error", res.error)
        }
    }


    useEffect(() => {
        const fetchAll = async () => {
            const res = await getAllReview()

            if (res.success) {
                setListReviews(res.data)
            }

        }

        fetchAll()
    }, [])


    return (
        <div className=" md:p-6 rounded-2xl overflow-hidden">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="operasi Berhasil!"
                errorTitle="operasi gagal"
            />
            {(editFormReview && (selectedReview != null)) && (
                <UpdateReviewModal
                    review={selectedReview}
                    onClose={() => {
                        setEditFormReview(false)
                        setSelectedReview(null)
                    }}
                    onSubmit={(data) => {
                        onEditReview(data, selectedReview.review_id)
                    }}
                />
            )}

            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline">
                    <h2 className="text-2xl font-bold mb-6">Daftar Produk</h2>
                    <h2 className="badge badge-ghost font-medium">
                        {listReviews.length} total
                    </h2>
                </div>
            </div>

            <div className="divider"></div>

            {listReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <p className="text-sm opacity-60">
                        Belum ada ulasan
                    </p>
                </div>
            ) : (

                <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {listReviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="border border-black rounded-xl p-4 flex flex-col gap-3 relative"
                        >

                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-2">

                                <div className="flex items-center gap-2">

                                    {/* AVATAR */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                                        {review.user.user_profile_picture ? (
                                            <img
                                                src={`${import.meta.env.VITE_IMAGE_URL}/user/${review.user.user_profile_picture}`}
                                                alt={review.user.user_fullname}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={16} className="opacity-50" />
                                        )}
                                    </div>

                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-medium">
                                            {review.user.user_fullname}
                                        </span>

                                        <span className="text-xs opacity-60">
                                            {new Date(review.review_created_at).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="flex gap-1">

                                    {currentUserId === review.user.user_id && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setEditFormReview(true)
                                                setSelectedReview(review)
                                            }}
                                            className="btn btn-ghost btn-sm btn-circle text-warning"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            // onDeleteReview(review)
                                        }}
                                        className="btn btn-ghost btn-xs btn-circle text-error"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                </div>
                            </div>

                            {/* STAR */}
                            {renderStars(review.review_rating, 14)}

                            {/* COMMENT */}
                            {review.review_comment && (
                                <p className="text-sm leading-relaxed opacity-80">
                                    {review.review_comment}
                                </p>
                            )}

                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}