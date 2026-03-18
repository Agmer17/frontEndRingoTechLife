import { type OrderStatus } from "../../types/order"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {

    const map = {
        pending: "badge badge-warning",
        waiting_confirmation: "badge badge-info",
        confirmed: "badge badge-success",
        cancelled: "badge badge-error"
    }

    return (
        <span className={map[status]}>
            {status.replace("_", " ")}
        </span>
    )

}