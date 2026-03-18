import { OrderDetail } from "./com/OrdersDetail"
import type { Order } from "../../types/order"

interface Props {
    order: Order
}

export default function OrderDetailPage({ order }: Props) {
    return (
        <div className="p-6">
            <OrderDetail order={order} />
        </div>
    )
}