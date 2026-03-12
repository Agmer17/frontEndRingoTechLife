import { useState } from "react";
import { useProducts } from "../products/useProducts";
import type { CreateProductRequest, Product, UpdateProductRequest } from "../../types/product";

export function useAdminProducts() {

    const { getAll, create, remove, getById, update, getBySlug } = useProducts()
    const [listProducts, setListProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getAllProducts = async () => {
        setLoading(true)
        const res = await getAll()
        setLoading(false)
        if (res.success) {
            setListProducts(res.data)
            return res
        } else {
            return res
        }
    }

    const createProducts = async (data: CreateProductRequest) => {
        setLoading(true)
        const res = await create(data)
        setLoading(false)
        return res
    }

    const deleteProducts = async (id: string) => {
        setLoading(true)
        const res = await remove(id)
        setLoading(false)
        return res
    }

    const getProductById = async (id: string) => {
        if (!id) {
            return { success: false as const, error: "id tidak ditemukan!" }
        }


        const res = await getById(id)

        return res
    }

    const updateData = async (initData: Product, updatedData: UpdateProductRequest) => {
        const res = await update(initData, updatedData)

        return res
    }

    const getProductBySlug = async (slug: string) => {

        const res = await getBySlug(slug)

        return res
    }

    return {
        getAllProducts,
        listProducts,
        loading,
        createProducts,
        deleteProducts,
        getProductById,
        updateData,
        getProductBySlug,
        setListProducts
    }
}