import { useParams } from "react-router";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { useEffect, useState } from "react";
import type { Product, UpdateProductRequest } from "../../types/product";
import UpdateProductForm from "./com/UpdateProductForm";
import { useAdminCategories } from "../../hooks/admin/useAdminCategories";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";


export default function AdminUpdateProduct() {
    const { id } = useParams();
    const { getProductById, updateData } = useAdminProducts()
    const { getAllCategories, categories } = useAdminCategories()
    const [products, setProducts] = useState<Product | null>(null)

    const { toast, dismissToast, showToast } = useToast();

    useEffect(() => {
        const initFetch = async () => {
            const res = await getProductById(id || "")
            if (res.success) {
                setProducts(res.data)
            }

            await getAllCategories()
        }

        initFetch()
    }, [])

    const handleUpdateProduct = async (data: UpdateProductRequest) => {
        if (!products) {
            showToast("success", "berhasil mengupdate data")
            return
        }

        const response = await updateData(products, data)

        if (response.success) {
            showToast("success", response.message)
        } else {
            showToast("error", response.error)
        }
    };


    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />

            {products && <UpdateProductForm product={products} categories={categories} onSubmit={handleUpdateProduct} />}
        </div>
    )
}