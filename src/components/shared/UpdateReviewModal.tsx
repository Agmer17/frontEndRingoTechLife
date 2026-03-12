import { useState, useEffect } from "react";
import StarRatingInput from "./StarRatingInput";
import type { Review, UpdateReviewRequest } from "../../types/review";

interface EditReviewModalProps {
    review: Review | null;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateReviewRequest, id: string) => void;
}

export default function UpdateReviewModal({
    review,
    loading = false,
    onClose,
    onSubmit,
}: EditReviewModalProps) {
    const [form, setForm] = useState({
        rating: 0,
        comment: "",
    });

    useEffect(() => {
        if (review) {
            setForm({
                rating: review.review_rating,
                comment: review.review_comment || "",
            });
        }
    }, [review]);

    if (!review) return null;

    const handleSubmit = () => {
        onSubmit(form, review.review_id);
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box bg-base-100 space-y-4">
                <h3 className="font-semibold text-lg">Edit Review</h3>

                <div>
                    <p className="text-sm mb-2 opacity-70">Rating</p>
                    <StarRatingInput
                        value={form.rating}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, rating: val }))
                        }
                    />
                </div>

                <div>
                    <p className="text-sm mb-2 opacity-70">Komentar</p>
                    <textarea
                        maxLength={255}
                        className="textarea textarea-bordered w-full bg-base-100"
                        value={form.comment}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                comment: e.target.value,
                            }))
                        }
                    />

                    <div className="text-right text-xs opacity-60 mt-1">
                        {form.comment.length}/255
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Batal
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}