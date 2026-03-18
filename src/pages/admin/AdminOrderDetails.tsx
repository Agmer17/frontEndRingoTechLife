import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Order } from "../../types/order";
import { useOrders } from "../../hooks/orders/useOrders";
import { OrderDetail } from "../../components/shared/OrderDetails";

export default function AdminOrderDetails() {

    const { id } = useParams()
    const { getByDetailId } = useOrders()
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getByDetailId(id || "")

            if (res.success) {
                setOrder(res.data)
            }
        }

        fetchData()
    }, [])

    if (!order) {
        return <div>Loading...</div>
    }


    return (
        <div className="md:p-6">
            <OrderDetail role="admin" order={order} />
        </div>
    )

}