import axiosInstance from "../../lib/axios";
import type { CreateReviewRequest, Review, UpdateReviewRequest } from "../../types/review";
import { handleApiError } from "../../utils/errorUtils";

export function useReviews() {

    const create = async (data: CreateReviewRequest) => {

        try {
            const resp = await axiosInstance.post("/reviews/create", {
                ...data
            })

            const message = resp.data.message
            const respData = resp.data.data

            return { success: true as const, message, data: respData }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const deleteReview = async (id: string) => {
        try {
            const resp = await axiosInstance.delete(`/reviews/delete/${id}`)
            const message = resp.data.message

            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const editReview = async (editData: UpdateReviewRequest, id: string) => {

        const payload: UpdateReviewRequest = {}

        if (editData.rating != null) payload.rating = editData.rating
        if (editData.comment != null) payload.comment = editData.comment
        try {
            const resp = await axiosInstance.put("/reviews/update/" + id, payload)

            const message = resp.data.message
            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getAllReview = async () => {
        try {
            const response = await axiosInstance.get("/reviews/get-all")

            const message = response.data.message
            const data = response.data.data as Review[]

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getMyReview = async () => {
        try {
            const response = await axiosInstance.get("/reviews/get-my-review")

            const message = response.data.message
            const data = response.data.data as Review[]

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const deleteCurrentUserReview = async (id: string) => {
        try {
            const response = await axiosInstance.delete("/reviews/delete-my-review/" + id)

            const message: string = await response.data.message
            return { success: true as const, message, data: {} }

        } catch (error) {
            return handleApiError(error)
        }
    }
    return { create, deleteReview, editReview, getAllReview, getMyReview, deleteCurrentUserReview }

}