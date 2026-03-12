import { useState } from "react";
import StarRatingInput from "./StarRatingInput";

interface AddReviewModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
}

export default function AddReviewModal({
  open,
  loading,
  onClose,
  onSubmit,
}: AddReviewModalProps) {
  const [form, setForm] = useState({
    rating: 0,
    comment: "",
  });

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 space-y-4">
        <h3 className="font-semibold text-lg">Tambah Review</h3>

        {/* Rating */}
        <div>
          <p className="text-sm mb-2 opacity-70">Rating</p>
          <StarRatingInput
            value={form.rating}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, rating: val }))
            }
          />
        </div>

        {/* Comment */}
        <div>
          <p className="text-sm mb-2 opacity-70">Komentar</p>
          <textarea
            maxLength={255}
            className="textarea textarea-bordered w-full bg-base-100"
            placeholder="Bagikan pengalamanmu dengan produk ini..."
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

        {/* Actions */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || form.rating === 0}
          >
            {loading ? "Mengirim..." : "Kirim Review"}
          </button>
        </div>
      </div>
    </div>
  );
}