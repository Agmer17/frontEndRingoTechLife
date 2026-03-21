import { OrdersTables } from "../../components/shared/OrdersTable"
import { type Order } from "../../types/order"
import { useEffect, useState } from "react"
import { useOrders } from "../../hooks/orders/useOrders"



export default function OrdersPage() {

    const [orders, setOrders] = useState<Order[]>([])
    const { getAllOrders } = useOrders()


    useEffect(() => {
        const fetchAll = async () => {
            const resp = await getAllOrders()

            if (resp.success) {
                if (resp.data == null) {
                    setOrders([])
                    console.log("Masuk ke null nih!")
                }
                setOrders(resp.data)
            }
        }

        fetchAll()
    }, [])

    return (
        <div className="md:p-6 space-y-4 md:space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl text-primary font-bold">Orders</h1>

                <select className="select border border-black focus:outline-none">
                    <option>All Status</option>
                    <option>pending</option>
                    <option>waiting_confirmation</option>
                    <option>confirmed</option>
                    <option>cancelled</option>
                </select>
            </div>

            <OrdersTables orders={orders} admin={true} />

        </div>
    )
}