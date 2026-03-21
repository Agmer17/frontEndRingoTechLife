import axiosInstance from "../../lib/axios"
import { handleApiError } from "../../utils/errorUtils"


export function usePayments() {


    const submitPayment = async (file: File, id: string) => {
        try {
            const formData = new FormData()

            formData.append("payment_order_id", id)
            formData.append("proof_image", file)
            const response = await axiosInstance.post("/payments/order", formData)

            const data = response.data.data
            const message = response.data.message

            return { success: true as const, data, message }

        } catch (error) {
            return handleApiError(error)
        }
    }


    const acceptPaymet = async (paymentId: string, notes: string | null) => {

        try {
            const response = await axiosInstance.post("/payments/accept", {
                payment_id: paymentId,
                notes: notes
            })

            const data = response.data.data
            const message = response.data.message

            return { success: true as const, data, message }

        } catch (error) {
            return handleApiError(error)
        }
    }

    const rejectPayment = async (paymentId: string, notes: string | null) => {

        try {
            const response = await axiosInstance.post("/payments/reject", {
                payment_id: paymentId,
                notes: notes
            })

            const data = response.data.data
            const message = response.data.message

            return { success: true as const, data, message }

        } catch (error) {
            return handleApiError(error)
        }
    }
    return { submitPayment, acceptPaymet, rejectPayment }
}