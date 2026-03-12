import { useState } from "react"
import { useReviews } from "../review/useReviews"
import type { Review, UpdateReviewRequest } from "../../types/review"

export function useAccountReview() {

    const [loading, setLoading] = useState(false)
    const { getMyReview, editReview, deleteCurrentUserReview } = useReviews()
    const [reviews, setReviews] = useState<Review[]>([])

    const fetchMyReview = async () => {
        setLoading(true)
        const res = await getMyReview()
        setLoading(false)
        if (res.success) {
            setReviews(res.data)
        }
    }

    const updateMyReview = async (updateReq: UpdateReviewRequest, id: string) => {
        const res = await editReview(updateReq, id)

        return res
    }


    const deleteMyReview = async (id: string) => {
        const res = await deleteCurrentUserReview(id)
        return res
    }
    return { loading, fetchMyReview, reviews, updateMyReview, deleteMyReview }
}