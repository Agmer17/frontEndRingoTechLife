import axiosInstance from "../../lib/axios"
import type { Category } from "../../types/Category"
import { handleApiError } from "../../utils/errorUtils"


export function useCategories() {

    const getAll = async () => {
        try {
            const response = await axiosInstance.get("/categories/get-all")
            const data = response.data.data as Category[]

            return { success: true as const, message: "", data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    return { getAll }
}