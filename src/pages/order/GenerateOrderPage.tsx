import { useNavigate, useParams } from "react-router"
import { useProducts } from "../../hooks/products/useProducts"
import { useEffect, useState } from "react"
import type { Product } from "../../types/product"
import { useToast } from "../../hooks/ui/useToast"
import { Toast } from "../../components/shared/Toast"
import { CreateOrderPage } from "../../components/shared/CreateOrderPage"
import { useOrders } from "../../hooks/orders/useOrders"
import type { CreateOrderRequest } from "../../types/order"
import { ArrowLeft } from "lucide-react"


export default function GenerateOrderPages() {

    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const { getById } = useProducts()
    const { toast, dismissToast, showToast } = useToast();

    const { createOrder } = useOrders()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductData = async (id: string) => {
            const res = await getById(id)
            if (res.success) {
                setProduct(res.data)
            } else {
                showToast("error", res.error)
            }
        }

        fetchProductData(id || "")
    }, [])


    const handleSubmit = async (data: CreateOrderRequest) => {
        const res = await createOrder(data)
        if (res.success) {
            showToast("success", "berhasil membuat order!");

            setTimeout(() => {
                navigate("/account/transactions");
            }, 1000);
        } else {
            showToast("error", res.error)
        }
    }
    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            <div className="w-full p-4 flex justify-start">
                <button onClick={() => {
                    navigate(-1)
                }} className="btn btn-circle btn-md bg-white border-none text-primary hover:bg-primary hover:text-white">
                    <ArrowLeft className="w-8 h-8" />
                </button>
            </div>
            {product && (
                <CreateOrderPage product={product} onSubmit={handleSubmit} />
            )}

        </div>
    )
}