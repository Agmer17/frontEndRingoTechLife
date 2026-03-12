import useMyOrders from "./../../hooks/account/useMyOrder"
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import { Clock } from "lucide-react";

export default function MyTransactions() {
    const { orders, loading, error } = useMyOrders();
    const { toast, showToast, dismissToast } = useToast();

    if (loading) return <p className="p-6">Loading orders...</p>;

    if (error) {
        showToast("error", error);
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    className: "badge-info",
                    label: "Pending",
                };

            case "waiting_confirmation":
                return {
                    className: "badge-warning",
                    label: "Menunggu Konfirmasi",
                };

            case "confirmed":
                return {
                    className: "badge-success",
                    label: "Terkonfirmasi",
                };

            case "cancelled":
                return {
                    className: "badge-error",
                    label: "Dibatalkan",
                };

            default:
                return {
                    className: "badge-neutral",
                    label: status,
                };
        }
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case "unpaid":
                return {
                    className: "badge-neutral",
                    label: "Belum Bayar",
                };

            case "submitted":
                return {
                    className: "badge-warning",
                    label: "Menunggu Verifikasi",
                };

            case "approved":
                return {
                    className: "badge-success",
                    label: "Disetujui",
                };

            case "rejected":
                return {
                    className: "badge-error",
                    label: "Ditolak",
                };

            default:
                return {
                    className: "badge-outline",
                    label: status,
                };
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <div className="text-center flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold">
                        Belum ada transaksi
                    </p>
                    <p className="text-sm text-base-content/60">
                        Kamu belum membeli apapun!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-semibold">
                Histori Transaksi
            </h1>

            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Berhasil!"
                errorTitle="Terjadi Kesalahan"
            />

            {orders.map((order) => {
                const badge = getStatusBadge(order.status);

                return (
                    <div
                        key={order.id}
                        className="border rounded-2xl p-4 sm:p-6 bg-base-100 shadow-sm space-y-5"
                    >
                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="space-y-1">
                                <p className="font-semibold text-sm sm:text-base">
                                    Order ID
                                </p>

                                <p className="text-xs sm:text-sm opacity-70 break-all">
                                    {order.id}
                                </p>

                                <div className="flex items-center gap-1 text-xs sm:text-sm opacity-70">
                                    <Clock size={14} />
                                    <span>
                                        {new Date(order.created_at)
                                            .toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                    </span>
                                </div>
                            </div>

                            <div className={`badge ${badge.className} self-start`}>
                                {badge.label}
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-3">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.product_name}
                                        </p>
                                        <p className="opacity-60 text-xs sm:text-sm">
                                            {item.quantity} x Rp{" "}
                                            {item.price_at_purchase.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    <p className="font-medium sm:text-right">
                                        Rp {item.subtotal.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div className="pt-4 border-t flex justify-between text-base sm:text-lg font-semibold">
                            <span>Total</span>
                            <span>
                                Rp {order.total_amount.toLocaleString("id-ID")}
                            </span>
                        </div>

                        {/* PAYMENT */}
                        {order.payment && (
                            <div className="pt-4 border-t space-y-3">
                                <p className="text-sm opacity-70">
                                    Status Pembayaran
                                </p>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    {(() => {
                                        const paymentBadge = getPaymentBadge(order.payment.status);

                                        return (
                                            <span className={`badge ${paymentBadge.className}`}>
                                                {paymentBadge.label}
                                            </span>
                                        );
                                    })()}

                                    <span className="text-sm font-medium">
                                        Rp {order.payment.amount.toLocaleString("id-ID")}
                                    </span>
                                </div>

                                {order.payment.proof_image && (
                                    <div className="mt-2">
                                        <img
                                            src={`${import.meta.env.VITE_IMAGE_URL}/payments/${order.payment.proof_image}`}
                                            alt="Bukti Pembayaran"
                                            className="w-full sm:w-64 rounded-xl object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}