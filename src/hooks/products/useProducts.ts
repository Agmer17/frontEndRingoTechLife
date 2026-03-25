import axiosInstance from "../../lib/axios"
import type { CreateProductRequest, Product, ProductHomeData, UpdateProductRequest } from "../../types/product"
import { handleApiError } from "../../utils/errorUtils"

export function useProducts() {

    const getAll = async () => {
        try {
            const response = await axiosInstance.get("/products/get-all")

            const productData = response.data.data as Product[]
            const message = response.data.message

            return { success: true as const, message, data: productData }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const create = async (data: CreateProductRequest) => {
        try {
            const formData = new FormData()

            formData.append("product_category_id", data.product_category_id)
            formData.append("product_name", data.product_name)
            formData.append("product_slug", data.product_slug)

            if (data.product_description)
                formData.append("product_description", data.product_description)

            if (data.product_brand)
                formData.append("product_brand", data.product_brand)

            formData.append("product_condition", data.product_condition)
            formData.append("product_sku", data.product_sku)
            formData.append("product_price", data.product_price.toString())
            formData.append("product_initial_stock", data.product_initial_stock.toString())

            if (data.product_specification)
                formData.append("product_specification", JSON.stringify(data.product_specification))

            formData.append("product_status", data.product_status)

            if (data.product_featured !== undefined)
                formData.append("product_featured", data.product_featured.toString())

            if (data.product_weight)
                formData.append("product_weight", data.product_weight.toString())

            if (data.product_images) {
                data.product_images.forEach((file) => {
                    formData.append("product_images", file)
                })
            }

            const response = await axiosInstance.post("/products/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            // const responseData = response.data.data
            const message = response.data.message

            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const remove = async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/products/delete/${id}`)

            const message = response.data.message

            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }

    }



    const getById = async (id: string) => {
        try {

            const response = await axiosInstance.get("/products/id/" + id)

            const data = response.data.data
            const message = response.data.message


            return { success: true as const, data, message }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const update = async (init: Product, newData: UpdateProductRequest) => {
        const form = new FormData()

        const append = (key: string, value: any) => {
            if (value === undefined || value === null) return

            if (typeof value === "object" && !(value instanceof File)) {
                form.append(key, JSON.stringify(value))
            } else {
                form.append(key, String(value))
            }
        }

        const appendIfChanged = (key: keyof UpdateProductRequest, newVal: any, oldVal: any) => {
            if (newVal === undefined) return
            if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
            append(key, newVal)
        }

        // =========================
        // FIELD COMPARISON
        // =========================

        appendIfChanged("product_category_id", newData.product_category_id, init.product_category_id)
        appendIfChanged("product_name", newData.product_name, init.product_name)
        appendIfChanged("product_slug", newData.product_slug, init.product_slug)
        appendIfChanged("product_description", newData.product_description, init.product_description)
        appendIfChanged("product_brand", newData.product_brand, init.product_brand)
        appendIfChanged("product_condition", newData.product_condition, init.product_condition)
        appendIfChanged("product_sku", newData.product_sku, init.product_sku)
        appendIfChanged("product_price", newData.product_price, init.product_price)
        appendIfChanged("product_initial_stock", newData.product_initial_stock, init.product_stock)
        appendIfChanged("product_status", newData.product_status, init.product_status)
        appendIfChanged("product_featured", newData.product_featured, init.product_is_featured)
        appendIfChanged("product_weight", newData.product_weight, init.product_weight)
        appendIfChanged("product_featured", newData.product_featured, init.product_is_featured)

        appendIfChanged(
            "product_specification",
            newData.product_specification,
            init.product_specification
        )

        // =========================
        // ARRAY SAFE APPEND
        // =========================

        const appendArray = (key: string, arr?: any[]) => {
            if (!arr || arr.length === 0) return
            arr.forEach(v => form.append(key, v))
        }

        const appendFileArray = (key: string, files?: File[]) => {
            if (!files || files.length === 0) return
            files.forEach(f => form.append(key, f))
        }

        appendFileArray("new_product_images", newData.product_new_images)
        appendArray("product_deleted_image", newData.product_deleted_image)
        appendArray("product_updated_image_id", newData.product_updated_image_id)
        appendFileArray("updated_image_files", newData.product_updated_image_files)

        try {
            const response = await axiosInstance.put("/products/update/" + init.product_id, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            const message = response.data.message

            return { success: true as const, message, data: null }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getBySlug = async (slug: string) => {
        try {
            const response = await axiosInstance.get("/products/slug/" + slug)

            const data = response.data.data

            return { success: true as const, message: "berhasil mengambil data", data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const searchProduct = async (query: string, cat?: string) => {
        try {
            const params: any = {}

            if (query) params.q = query
            if (cat) params.c = cat

            const response = await axiosInstance.get("/products/search", {
                params
            })

            const data = response.data.data as Product[]

            return { success: true as const, message: "berhasil mengambil data", data }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getHomeData = async () => {
        try {

            const response = await axiosInstance.get("/products/home-data")

            const data = response.data.data as ProductHomeData
            return { success: true as const, message: "berhasil mengambil data", data }

        } catch (error) {
            return handleApiError(error)
        }
    }

    return { getAll, create, remove, getById, update, getBySlug, searchProduct, getHomeData }
}