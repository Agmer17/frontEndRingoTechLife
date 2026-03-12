import { useState } from "react"
import { useCategories } from "../Category/useCategory"
import type { Category } from "../../types/Category"

export function useAdminCategories() {

    const { getAll } = useCategories()
    const [categories, setCategories] = useState<Category[]>([])

    const getAllCategories = async () => {
        const res = await getAll()

        if (res.success) {
            setCategories(res.data)
        }

        return res
    }

    return { getAllCategories, categories }
}