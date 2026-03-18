import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Order } from "../../types/order";
import { OrderDetail } from "../../components/shared/OrderDetails";
import { useOrders } from "../../hooks/orders/useOrders";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";

export default function UserDetailTransacion() {

    const { id } = useParams()
    const [order, setOrder] = useState<Order | null>(null)

    const { getByDetailId } = useOrders()
    const { toast, dismissToast, showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getByDetailId(id || "")

            if (res.success) {
                setOrder(res.data)
            } else {
                showToast("error", res.error)
            }

        }

        fetchData()
    }, [])


    return (
        <div className="w-full md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            {order != null && (<OrderDetail order={order} role={"user"} />)}
        </div>
    )


}