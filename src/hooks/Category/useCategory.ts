import axiosInstance from "../../lib/axios"
import type { Category, createCategory, UpdateCategoryRequest } from "../../types/Category"
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

    const create = async (newData: createCategory) => {
        try {
            const response = await axiosInstance.post("/categories/add", newData)

            const message = response.data.message
            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const deleteCategories = async (id: string) => {
        try {
            const response = await axiosInstance.delete("/categories/delete/" + id)
            const message = response.data.message
            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const update = async (data: UpdateCategoryRequest, id: string) => {

        try {
            const response = await axiosInstance.put("/categories/update/" + id, data)
            const message = response.data.message
            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }

    return { getAll, create, deleteCategories, update }
}