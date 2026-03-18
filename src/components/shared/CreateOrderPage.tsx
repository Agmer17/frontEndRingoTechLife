"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingBag, Clock, QrCode, Package } from "lucide-react"
import { type Product, type ProductImage } from "../../types/product"
import { type CreateOrderRequest } from "../../types/order"

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtRp(n: number) {
    return "Rp " + n.toLocaleString("id-ID")
}

// ─── props ────────────────────────────────────────────────────────────────────

interface Props {
    product: Product
    isLoading?: boolean
    onSubmit: (payload: CreateOrderRequest) => void
}


function getPrimaryImage(images: ProductImage[]): ProductImage | null {
    return images.find(img => img.display_order === 0) || null;
}
// ─── quantity control ─────────────────────────────────────────────────────────

function QuantityControl({
    value,
    max,
    onChange,
}: {
    value: number
    max: number
    onChange: (v: number) => void
}) {
    return (
        <div className="flex items-center border border-base-300 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={value <= 1}
                className="w-9 h-9 flex items-center justify-center hover:bg-base-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <Minus size={13} />
            </button>
            <span className="w-11 text-center text-sm font-semibold tabular-nums select-none border-x border-base-300">
                {value}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="w-9 h-9 flex items-center justify-center hover:bg-base-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <Plus size={13} />
            </button>
        </div>
    )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function CreateOrderPage({ product, isLoading = false, onSubmit }: Props) {
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState("")


    const subtotal = product.product_price * quantity
    const isLowStock = product.product_stock <= 5 && product.product_stock > 0

    const primaryImage = getPrimaryImage(product.product_images);


    function handleSubmit() {
        onSubmit({
            product_id: product.product_id,
            product_quantity: quantity,
            order_notes: notes.trim() || null,
        })
    }

    return (
        <div className="max-w-lg mx-auto px-4 pt-4 pb-28">

            {/* ── PRODUCT SUMMARY ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none mb-3">
                <div className="card-body p-0">

                    <div className="px-5 pt-4 pb-2">
                        <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                            Detail produk
                        </p>
                    </div>

                    <div className="flex gap-3.5 px-5 pb-5 items-start">
                        {/* thumbnail */}
                        <div className="w-18 h-18 rounded-lg bg-base-200 border border-base-200 overflow-hidden shrink-0 flex items-center justify-center text-base-content/30">
                            {primaryImage
                                ? <img src={`${import.meta.env.VITE_IMAGE_URL}/products/${primaryImage.image_url}`} alt={product.product_name} className="w-full h-full object-cover" />
                                : <Package size={28} strokeWidth={1.5} />
                            }
                        </div>

                        {/* info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-snug text-base-content">
                                {product.product_name}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                                {product.product_brand && (
                                    <span className="text-xs text-base-content/40">
                                        {product.product_brand}
                                    </span>
                                )}
                                {product.product_sku && (
                                    <span className="badge badge-sm bg-base-200 text-base-content/50 font-mono border-0">
                                        {product.product_sku}
                                    </span>
                                )}
                            </div>
                            <p className="text-base font-semibold mt-2">
                                {fmtRp(product.product_price)}
                            </p>
                        </div>
                    </div>

                    <div className="divider m-0" />

                    {/* quantity row */}
                    <div className="flex items-center justify-between px-5 py-3.5 gap-4">
                        <div>
                            <p className="text-sm font-medium text-base-content">Jumlah</p>
                            <p className={`text-xs mt-0.5 ${isLowStock ? "text-warning" : "text-base-content/40"}`}>
                                {isLowStock
                                    ? `Sisa ${product.product_stock} stok`
                                    : `Stok: ${product.product_stock}`
                                }
                            </p>
                        </div>
                        <QuantityControl
                            value={quantity}
                            max={product.product_stock}
                            onChange={setQuantity}
                        />
                    </div>

                </div>
            </div>

            {/* ── PAYMENT METHOD ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none mb-3">
                <div className="card-body px-5 py-4 flex-row items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                        <QrCode size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-base-content">QRIS</p>
                        <p className="text-xs text-base-content/50 mt-0.5">
                            Instruksi pembayaran dikirim setelah pesanan dibuat
                        </p>
                    </div>
                </div>
            </div>

            {/* ── NOTES ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none mb-3">
                <div className="card-body px-5 py-4">
                    <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide mb-3">
                        Catatan
                        <span className="ml-1 font-normal normal-case">(opsional)</span>
                    </p>
                    <textarea
                        className="textarea textarea-bordered w-full text-sm resize-none leading-relaxed"
                        rows={3}
                        maxLength={500}
                        placeholder="Misal: warna preferensi, ukuran, atau catatan lain untuk penjual..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <p className="text-xs text-base-content/30 text-right mt-1">
                        {notes.length}/500
                    </p>
                </div>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none mb-3">
                <div className="card-body p-0">
                    <div className="px-5 pt-4 pb-2">
                        <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                            Ringkasan pesanan
                        </p>
                    </div>
                    <div className="flex justify-between px-5 py-2 text-sm text-base-content/60">
                        <span>{product.product_name} × {quantity}</span>
                        <span>{fmtRp(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-3.5 border-t border-base-200">
                        <span className="text-sm font-medium">Total pembayaran</span>
                        <span className="text-xl font-semibold">{fmtRp(subtotal)}</span>
                    </div>
                </div>
            </div>

            {/* ── DEADLINE INFO ── */}
            <div className="flex items-start gap-2 px-1 text-xs text-base-content/40 leading-relaxed">
                <Clock size={12} className="mt-0.5 shrink-0" />
                <span>
                    Pesanan otomatis dibatalkan jika pembayaran tidak diterima dalam batas waktu yang ditentukan.
                </span>
            </div>

            {/* ── STICKY FOOTER ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 px-4 py-3 z-10">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <div>
                        <p className="text-xs text-base-content/50">Total</p>
                        <p className="text-lg font-semibold tabular-nums">{fmtRp(subtotal)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="btn btn-primary flex-1"
                    >
                        {isLoading
                            ? <><span className="loading loading-spinner loading-sm" /> Membuat pesanan...</>
                            : <><ShoppingBag size={15} /> Buat Pesanan</>
                        }
                    </button>
                </div>
            </div>

        </div>
    )
}