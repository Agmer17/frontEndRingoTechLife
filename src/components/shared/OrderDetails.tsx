"use client"

import { type Order, type OrderStatus } from "../../types/order"
import { type PaymentStatus } from "../../types/payment"
import { Check, X, ZoomOut, ZoomIn, ShoppingBag } from "lucide-react"
import { useCountdown } from "../../hooks/timer/useCountdown"
import { useState } from "react"
import { PaymentModal } from "./PaymentModal"
import { usePayments } from "../../hooks/payment/usePayment"
import { Toast } from "./Toast"
import { useToast } from "../../hooks/ui/useToast"
import { useNavigate } from "react-router"

interface Props {
    order: Order
    role: "admin" | "user"
}

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(iso?: string | null) {
    if (!iso) return "—"

    const local = iso.replace("Z", "") // hilangkan UTC marker

    return new Date(local).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }) + " WIB"
}

function fmtRp(n: number) {
    return "Rp " + n.toLocaleString("id-ID")
}

// ─── badge maps ─────────────────────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Menunggu Pembayaran", className: "badge-warning" },
    waiting_confirmation: { label: "Menunggu Konfirmasi", className: "badge-info" },
    confirmed: { label: "Pesanan Dikonfirmasi", className: "badge-success" },
    cancelled: { label: "Dibatalkan", className: "badge-error" },
}

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; className: string }> = {
    unpaid: { label: "Belum Dibayar", className: "badge-warning" },
    submitted: { label: "Menunggu Verifikasi", className: "badge-info" },
    approved: { label: "Pembayaran Disetujui", className: "badge-success" },
    rejected: { label: "Pembayaran Ditolak", className: "badge-error" },
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ label, className }: { label: string; className: string }) {
    return (
        <span className={`badge badge-sm gap-1.5 ${className}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
            {label}
        </span>
    )
}

function Stepper({ status }: { status: OrderStatus }) {
    const steps = [
        { key: "created", label: "Pesanan\ndibuat" },
        { key: "payment", label: "Menunggu\nbayar" },
        { key: "confirm", label: "Konfirmasi\nadmin" },
        { key: "done", label: "Pesanan\nselesai" },
    ]

    // active index per status
    const activeIndex: Record<OrderStatus, number> = {
        pending: 1,
        waiting_confirmation: 2,
        confirmed: 3,
        cancelled: 1,
    }

    const active = activeIndex[status]
    const isCancelled = status === "cancelled"

    return (
        <div className="flex items-start justify-between px-4 pb-5 pt-4 gap-0">
            {steps.map((step, i) => {
                const isDone = i < active
                const isActive = i === active
                const isCancelHit = isCancelled && i === active

                const circleClass = isCancelHit
                    ? "bg-error border-error text-error-content"
                    : isDone
                        ? "bg-success border-success text-success-content"
                        : isActive
                            ? "bg-info border-info text-info-content"
                            : "bg-base-100 border-base-300 text-base-content/40"

                const labelClass = isCancelHit
                    ? "text-error"
                    : isDone
                        ? "text-success"
                        : isActive
                            ? "text-info font-semibold"
                            : "text-base-content/40"

                const lineClass = isDone
                    ? "bg-success"
                    : "bg-base-300"

                return (
                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                        {/* connector line */}
                        {i < steps.length - 1 && (
                            <div
                                className={`absolute top-2.75 left-[58%] h-[1.5px] z-0 transition-colors ${lineClass}`}
                                style={{ width: "84%" }}
                            />
                        )}

                        {/* circle */}
                        <div
                            className={`w-5.5 h-5.5 rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-medium z-10 ${circleClass}`}
                        >
                            {isCancelHit ? "✕" : isDone ? "✓" : i + 1}
                        </div>

                        {/* label */}
                        <p className={`text-[10px] mt-1.5 text-center leading-tight whitespace-pre-line ${labelClass}`}>
                            {step.label}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

// ─── main component ──────────────────────────────────────────────────────────

export function OrderDetail({ order, role }: Props) {
    const { hours, minutes, seconds, expired } = useCountdown(order.expires_at)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const { submitPayment, acceptPaymet, rejectPayment } = usePayments()
    const navigate = useNavigate()

    const isPending = order.status === "pending"
    const isWaitingConfirmation = order.status === "waiting_confirmation"
    const isConfirmed = order.status === "confirmed"
    const isCancelled = order.status === "cancelled"
    const payStatus = order.payment?.status ?? "unpaid"
    const { toast, dismissToast, showToast } = useToast();

    const handleSubmitPayment = async (file: File) => {
        const res = await submitPayment(file, order.id)

        if (res.success) {
            showToast("success", res.message)
        } else {
            showToast("error", res.error)
        }

        setShowPaymentModal(false)
        navigate(0)
    }

    const acceptPaymentHandle = async () => {
        if (role != "admin" || order.payment == null) {
            return
        }

        const res = await acceptPaymet(order.payment.id, null)

        if (res.success) {
            showToast("success", res.message, {
                onSuccess: () => {
                    navigate("/admin/orders")
                }
            })
        } else {
            showToast("error", res.error)

        }


    }
    const rejectPaymentHandle = async () => {
        if (role != "admin" || order.payment == null) {
            return
        }

        const res = await rejectPayment(order.payment.id, null)

        if (res.success) {
            showToast("success", res.message, {
                onSuccess: () => {
                    navigate("/admin/orders")
                }
            })
        } else {
            showToast("error", res.error)

        }


    }

    // show timer only when order is still pending and not yet expired
    const showTimer = isPending && !expired
    const showExpired = isPending && expired

    // admin sees approve/reject only when payment has been submitted
    const showAdminAction = role === "admin" && isWaitingConfirmation

    // user pay button state
    const userCanPay = role === "user" && isPending && !expired

    // payment extra rows
    const showSubmittedAt = isWaitingConfirmation || isConfirmed
    const showVerifiedBy = isConfirmed
    const showAdminNote = !!order.payment?.admin_note

    // bukti bayar: tampil untuk semua role, hanya saat status submitted
    const showProofImage = (order.payment?.status === "submitted" && !!order.payment?.proof_image) || order.payment?.status == "approved" || order.payment?.status == "rejected"

    const [previewOpen, setPreviewOpen] = useState(false)
    const [zoom, setZoom] = useState(1)

    return (
        <div className="max-w-2xl mx-auto space-y-3 pb-8">

            {previewOpen && order.payment?.proof_image && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300 backdrop-blur-sm">

                    {/* BACKDROP CLICK CLOSE */}

                    <div
                        className="absolute inset-0"
                        onClick={() => setPreviewOpen(false)}
                    />

                    {/* MODAL */}

                    <div className="relative z-10 flex flex-col items-center gap-6 max-w-6xl w-full px-6">

                        {/* CLOSE BUTTON */}

                        <button
                            onClick={() => setPreviewOpen(false)}
                            className="btn btn-circle btn-sm absolute top-4 right-9 z-[9999] shadow-lg"
                        >
                            <X size={18} />
                        </button>

                        {/* IMAGE CONTAINER */}

                        {showProofImage && (
                            <div className="overflow-auto max-h-[80vh] rounded-box shadow-xl">
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/payments/${order.payment.proof_image}`}
                                    alt="Bukti pembayaran"
                                    style={{ transform: `scale(${zoom})` }}
                                    className="transition-transform duration-200 ease-out max-w-full"
                                />

                            </div>

                        )}

                        {/* CONTROLS */}

                        <div className="flex items-center gap-3 bg-base-100 shadow-lg rounded-full px-4 py-2">

                            <button
                                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <ZoomOut size={18} />
                            </button>

                            <span className="text-sm font-medium opacity-70 w-12 text-center">
                                {Math.round(zoom * 100)}%
                            </span>

                            <button
                                onClick={() => setZoom((z) => z + 0.2)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <ZoomIn size={18} />
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            {showPaymentModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 sm:p-6 pb-24 sm:pb-6">

                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <PaymentModal
                            order={order}
                            isLoading={false}
                            onSubmit={(file) => handleSubmitPayment(file)}
                            onClose={() => setShowPaymentModal(false)}
                        />
                    </div>

                </div>
            )}
            {/* ── HEADER ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-5 pb-0">

                    <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                            <h1 className="text-lg font-semibold">Order #{order.id}</h1>
                            <p className="text-xs text-base-content/50 mt-0.5">
                                Dibuat: {fmt(order.created_at)}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <StatusBadge {...ORDER_STATUS_MAP[order.status]} />
                            {order.payment && (
                                <StatusBadge {...PAYMENT_STATUS_MAP[payStatus]} />
                            )}
                        </div>
                    </div>
                </div>

                {/* stepper */}
                <Stepper status={order.status} />

                {/* alert bars */}
                <div className="px-5 pb-5 space-y-2">

                    {showTimer && (
                        <div className="alert bg-warning/10 border border-warning/30 py-2.5 px-4">
                            <div className="flex-1 text-sm">
                                {role === "user"
                                    ? "Selesaikan pembayaran sebelum waktu habis"
                                    : "Menunggu pembayaran dari pembeli"}
                                <p className="text-xs opacity-60 mt-0.5">
                                    {role === "user"
                                        ? "Pesanan dibatalkan otomatis jika melewati batas waktu"
                                        : "Pesanan dibatalkan otomatis jika pembeli tidak membayar"}
                                </p>
                            </div>
                            <span className="text-lg font-semibold tabular-nums text-warning">
                                {hours.toString().padStart(2, "0")}:
                                {minutes.toString().padStart(2, "0")}:
                                {seconds.toString().padStart(2, "0")}
                            </span>
                        </div>
                    )}

                    {showExpired && (
                        <div className="alert alert-error py-2.5 px-4 text-sm">
                            {role === "user"
                                ? "Waktu pembayaran habis. Pesanan dibatalkan secara otomatis."
                                : "Pembeli tidak membayar tepat waktu. Pesanan dibatalkan."}
                        </div>
                    )}

                    {isWaitingConfirmation && (
                        <div className="alert bg-info/10 border border-info/30 py-2.5 px-4 text-sm text-info">
                            {role === "user"
                                ? "Bukti pembayaran kamu sedang diverifikasi oleh admin."
                                : "Pembeli telah mengunggah bukti pembayaran. Silakan verifikasi."}
                        </div>
                    )}

                    {isConfirmed && (
                        <div className="alert bg-success/10 border border-success/30 py-2.5 px-4 text-sm text-success">
                            {role === "user"
                                ? "Pembayaran dikonfirmasi. Pesanan kamu sedang diproses."
                                : "Pembayaran telah diverifikasi. Pesanan dikonfirmasi."}
                        </div>
                    )}

                    {isCancelled && (
                        <div className="alert alert-error py-2.5 px-4 text-sm">
                            Pesanan ini telah dibatalkan.
                            {order.cancelled_at && (
                                <span className="ml-1 opacity-70">· {fmt(order.cancelled_at)}</span>
                            )}
                        </div>
                    )}

                </div>
            </div>


            {/* ── ORDER ITEMS ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-0">

                    <div className="px-5 pt-4 pb-2">
                        <h2 className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                            Produk dipesan
                        </h2>
                    </div>

                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-3 px-5 py-3.5 border-t border-base-200"
                        >
                            {/* initials avatar */}
                            <div className="w-11 h-11 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center text-xs font-medium text-base-content/50 shrink-0 uppercase">
                                <ShoppingBag size={15} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-base-content truncate">
                                    {item.product_name}
                                </p>
                                {item.product_sku && (
                                    <p className="text-xs text-base-content/40 mt-0.5">
                                        SKU: {item.product_sku}
                                    </p>
                                )}
                                <p className="text-xs text-base-content/50 mt-0.5">
                                    {item.quantity} × {fmtRp(item.price_at_purchase)}
                                </p>
                            </div>

                            <div className="text-sm font-semibold text-base-content shrink-0">
                                {fmtRp(item.subtotal)}
                            </div>
                        </div>
                    ))}

                </div>
            </div>


            {/* ── PAYMENT INFO ── */}
            {order.payment && (
                <div className="card bg-base-100 border border-base-200 shadow-none">
                    <div className="card-body p-0">

                        <div className="px-5 pt-4 pb-2">
                            <h2 className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                                Informasi pembayaran
                            </h2>
                        </div>

                        <div className="divide-y divide-base-200">

                            <div className="flex justify-between items-center px-5 py-3 text-sm">
                                <span className="text-base-content/60">Status pembayaran</span>
                                <StatusBadge {...PAYMENT_STATUS_MAP[payStatus]} />
                            </div>

                            <div className="flex justify-between items-center px-5 py-3 text-sm">
                                <span className="text-base-content/60">Jumlah tagihan</span>
                                <span className="font-semibold">{fmtRp(order.payment.amount)}</span>
                            </div>

                            {showSubmittedAt && order.payment.submitted_at && (
                                <div className="flex justify-between items-center px-5 py-3 text-sm">
                                    <span className="text-base-content/60">Bukti dikirim</span>
                                    <span>{fmt(order.payment.submitted_at)}</span>
                                </div>
                            )}

                            {order.payment?.proof_image && (
                                <div className="flex justify-between items-center px-5 py-3 text-sm">

                                    <span className="text-base-content/60">
                                        Bukti pembayaran
                                    </span>

                                    <img
                                        src={`${import.meta.env.VITE_IMAGE_URL}/payments/${order.payment.proof_image}`}
                                        alt="Bukti pembayaran"
                                        onClick={() => {
                                            setPreviewOpen(true)
                                            setZoom(1)
                                        }}
                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-base-300 hover:opacity-80 transition"
                                    />

                                </div>
                            )}

                            {showVerifiedBy && order.payment.verified_by && (
                                <div className="flex justify-between items-center px-5 py-3 text-sm">
                                    <span className="text-base-content/60">Diverifikasi oleh</span>
                                    <span>{order.payment.verified_by}</span>
                                </div>
                            )}

                            {showVerifiedBy && order.payment.verified_at && (
                                <div className="flex justify-between items-center px-5 py-3 text-sm">
                                    <span className="text-base-content/60">Waktu verifikasi</span>
                                    <span>{fmt(order.payment.verified_at)}</span>
                                </div>
                            )}

                            {showAdminNote && (
                                <div className="px-5 py-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1.5">
                                        Catatan admin
                                    </p>
                                    <p className="text-sm text-base-content">
                                        {order.payment.admin_note}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}


            {/* ── ORDER NOTES ── */}
            {order.notes && (
                <div className="card bg-base-100 border border-base-200 shadow-none">
                    <div className="card-body px-5 py-4">
                        <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide mb-1.5">
                            Catatan pesanan
                        </p>
                        <p className="text-sm text-base-content/70 italic">{order.notes}</p>
                    </div>
                </div>
            )}


            {/* ── PRICE SUMMARY ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-0">

                    <div className="px-5 pt-4 pb-2">
                        <h2 className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                            Ringkasan harga
                        </h2>
                    </div>

                    <div className="divide-y divide-base-200">
                        <div className="flex justify-between px-5 py-2.5 text-sm text-base-content/60">
                            <span>Subtotal ({order.items?.length ?? 0} produk)</span>
                            <span>{fmtRp(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center px-5 py-3.5">
                            <span className="font-semibold">Total pembayaran</span>
                            <span className="text-xl font-semibold">{fmtRp(order.total_amount)}</span>
                        </div>
                    </div>

                </div>
            </div>


            {/* ── TIMESTAMPS ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body px-5 py-4 space-y-2">
                    <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide mb-1">
                        Riwayat waktu
                    </p>
                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Pesanan dibuat</span>
                        <span>{fmt(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Batas pembayaran</span>
                        <span>{fmt(order.expires_at)}</span>
                    </div>
                    {order.confirmed_at && (
                        <div className="flex justify-between text-sm">
                            <span className="text-base-content/60">Dikonfirmasi</span>
                            <span className="text-success">{fmt(order.confirmed_at)}</span>
                        </div>
                    )}
                    {order.cancelled_at && (
                        <div className="flex justify-between text-sm">
                            <span className="text-base-content/60">Dibatalkan</span>
                            <span className="text-error">{fmt(order.cancelled_at)}</span>
                        </div>
                    )}
                </div>
            </div>


            {/* ── USER: PAY BUTTON ── */}
            {role === "user" && (
                <div className="card bg-base-100 border border-base-200 shadow-none">
                    <div className="card-body px-5 py-4">
                        {userCanPay ? (
                            <button
                                onClick={() => {
                                    setShowPaymentModal(true)
                                }}
                                className="btn btn-primary w-full">
                                Bayar Sekarang
                            </button>
                        ) : isWaitingConfirmation ? (
                            <button className="btn btn-disabled w-full" disabled>
                                Menunggu Konfirmasi Admin
                            </button>
                        ) : isConfirmed ? (
                            <button className="btn btn-disabled w-full" disabled>
                                Pembayaran Selesai
                            </button>
                        ) : (
                            <button className="btn btn-disabled w-full" disabled>
                                Pesanan Dibatalkan
                            </button>
                        )}
                    </div>
                </div>
            )}


            {/* ── ADMIN: APPROVE / REJECT ── */}
            {showAdminAction && (
                <div className="card bg-base-100 border border-base-200 shadow-none">
                    <div className="card-body px-5 py-4">
                        <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide mb-3">
                            Tindakan admin
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="btn btn-success flex-1 whitespace-nowrap"
                                onClick={acceptPaymentHandle}
                            >
                                <Check size={15} />
                                Setujui Pembayaran
                            </button>
                            <button
                                className="btn btn-error btn-outline flex-1"
                                onClick={rejectPaymentHandle}
                            >
                                <X size={15} />
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}