"use client"

import { Link } from "react-router"
import type { Order } from "../../types/order"
import { Eye, Clock } from "lucide-react"

interface Props {
    orders: Order[]
    admin?: boolean
}

export function OrdersTables({ orders, admin = false }: Props) {

    const orderStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Pending", className: "badge-warning" }

            case "waiting_confirmation":
                return { label: "menunggu konfirmasi", className: "badge-info whitespace-nowrap" }

            case "confirmed":
                return { label: "Confirmed", className: "badge-success" }

            case "cancelled":
                return { label: "Cancelled", className: "badge-error" }

            default:
                return { label: status, className: "badge-ghost" }
        }
    }



    const paymentStatusBadge = (status?: string) => {
        switch (status) {
            case "unpaid":
                return { label: "Unpaid", className: "badge-warning" }

            case "submitted":
                return { label: "Submitted", className: "badge-info" }

            case "approved":
                return { label: "Approved", className: "badge-success" }

            case "rejected":
                return { label: "Rejected", className: "badge-error" }

            default:
                return { label: "-", className: "badge-ghost" }
        }
    }

    if (orders == null || orders.length === 0) {
        return (
            <div className="text-center py-16 opacity-60">
                Belum ada pesanan
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-5">

            {orders.map((order) => {

                const orderBadge = orderStatusBadge(order.status)
                const paymentBadge = paymentStatusBadge(order.payment?.status)

                return (
                    <div
                        key={order.id}
                        className="card bg-base-100 border border-black"
                    >

                        <div className="card-body space-y-4">

                            {/* HEADER */}

                            <div className="flex justify-between items-start gap-4">

                                <div className="space-y-1">

                                    <p className="font-semibold text-sm">
                                        Order ID
                                    </p>

                                    <p className="text-xs opacity-70 font-mono break-all">
                                        {order.id}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs opacity-70">
                                        <Clock size={14} />
                                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>

                                </div>

                                <div className="flex flex-col items-end gap-2">

                                    <span className={`badge ${orderBadge.className}`}>
                                        {orderBadge.label}
                                    </span>

                                </div>

                            </div>


                            {/* USER INFO */}

                            {order.user && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/60">

                                    {order.user.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGE_URL}/user/${order.user.profile_picture}`}
                                            alt={order.user.full_name}
                                            className="w-8 h-8 rounded-full object-cover border border-base-300 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-semibold text-base-content/60 shrink-0 uppercase">
                                            {order.user.full_name?.charAt(0) ?? "?"}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {order.user.full_name}
                                        </p>
                                        <p className="text-xs opacity-50 truncate">
                                            {order.user.email}
                                        </p>
                                    </div>

                                    {order.user.phone_number && (
                                        <p className="text-xs opacity-60 shrink-0">
                                            {order.user.phone_number}
                                        </p>
                                    )}

                                </div>
                            )}


                            {/* ITEMS */}

                            <div className="space-y-3">

                                {order.items?.slice(0, 2).map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >

                                        <div>

                                            <p className="font-medium">
                                                {item.product_name}
                                            </p>

                                            <p className="opacity-60 text-xs">
                                                {item.quantity} × Rp{" "}
                                                {item.price_at_purchase.toLocaleString("id-ID")}
                                            </p>

                                        </div>

                                        <p className="font-medium">
                                            Rp {item.subtotal.toLocaleString("id-ID")}
                                        </p>

                                    </div>

                                ))}

                                {order.items && order.items.length > 2 && (
                                    <p className="text-xs opacity-60">
                                        +{order.items.length - 2} more items
                                    </p>
                                )}

                            </div>


                            {/* FOOTER */}

                            <div className="flex flex-col justify-between gap-4 border-t pt-4 md:flex-row md:items-center">

                                <div>

                                    <p className="text-xs opacity-60">
                                        Total
                                    </p>

                                    <div className="gap-4 flex items-center">
                                        <p className="text-lg font-semibold">
                                            Rp {order.total_amount.toLocaleString("id-ID")}
                                        </p>
                                        {order.payment && (
                                            <span className={`badge badge-sm ${paymentBadge.className}`}>
                                                {paymentBadge.label}
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <Link
                                    to={admin
                                        ? `/admin/orders/${order.id}`
                                        : `/account/transactions/${order.id}`
                                    }
                                    className="btn btn-sm gap-2"
                                >
                                    <Eye size={16} />
                                    Lihat Detail
                                </Link>

                            </div>

                        </div>

                    </div>
                )

            })}

        </div>
    )
}