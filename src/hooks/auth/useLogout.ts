import axiosInstance from "../../lib/axios"
import { handleApiError } from "../../utils/errorUtils"

export const useLogout = () => {
    const accountLogout = async () => {
        try {
            const response = await axiosInstance.get("/auth/logout")

            const resData = response.data.data

            return { success: true as const, message: resData.message }
        } catch (error) {
            return handleApiError(error)
        }
    }

    return { accountLogout }
}