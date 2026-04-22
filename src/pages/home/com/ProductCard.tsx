import { useState } from "react"
import { Link } from "react-router"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import type { Product, ProductImage } from "../../../types/product"

const IMAGE_BASE = `${import.meta.env.VITE_IMAGE_URL}/products/`

function fmtRp(n: number) {
    return "Rp " + n.toLocaleString("id-ID")
}

const conditionBadge: Record<string, { label: string; className: string }> = {
    new: { label: "Baru", className: "badge-success" },
    used: { label: "Bekas", className: "badge-warning" },
    refurbished: { label: "Rekondisi", className: "badge-info" },
}

// ─── Carousel (sama persis logic aslinya, disesuaikan agar tidak kepotong) ────

function CardImageCarousel({
    images,
    productName,
}: {
    images: ProductImage[]
    productName: string
}) {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order)
    const primaryIndex = sorted.findIndex((img) => img.is_primary)
    const [currentIndex, setCurrentIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0)

    const prev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((i) => (i - 1 + sorted.length) % sorted.length)
    }

    const next = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((i) => (i + 1) % sorted.length)
    }

    if (sorted.length === 0) {
        return (
            <div className="aspect-square w-full bg-base-200 flex items-center justify-center text-base-content/20">
                <ImageOff size={28} />
            </div>
        )
    }

    return (
        <div className="relative w-full pt-[100%] bg-base-200">
            <img
                src={`${IMAGE_BASE}${sorted[currentIndex].image_url}`}
                alt={`${productName} - ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {sorted.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-1 top-1/2 -translate-y-1/2 btn btn-xs btn-circle bg-base-100/90 border border-base-200 hover:bg-base-100 shadow-sm"
                    >
                        <ChevronLeft size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-xs btn-circle bg-base-100/90 border border-base-200 hover:bg-base-100 shadow-sm"
                    >
                        <ChevronRight size={12} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {sorted.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setCurrentIndex(i)
                                }}
                                className={`h-1 rounded-full transition-all duration-200 ${i === currentIndex
                                    ? "bg-primary w-4"
                                    : "bg-base-100 w-1.5"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export default function ProductCard({ product }: { product: Product }) {
    const condition = conditionBadge[product.product_condition]

    return (
        <Link to={`/products/detail/${product.product_slug}`} className="group block h-full">
            {/* overflow-hidden di sini aman karena tombol carousel ada di dalam area aspect-square */}
            <div className="bg-base-100 border border-black rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">

                {/* Carousel */}
                <CardImageCarousel
                    images={product.product_images}
                    productName={product.product_name}
                />

                {/* Info */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                    {product.product_brand && (
                        <p className="text-xs text-base-content/40 truncate">
                            {product.product_brand}
                        </p>
                    )}

                    <p className="text-sm font-medium leading-snug line-clamp-2 text-base-content">
                        {product.product_name}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {condition && (
                            <span className={`badge badge-sm ${condition.className}`}>
                                {condition.label}
                            </span>
                        )}
                        {product.product_is_featured && (
                            <span className="badge badge-sm badge-warning">
                                Unggulan
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-semibold mt-auto pt-2 text-base-content">
                        {fmtRp(product.product_price)}
                    </p>
                </div>

            </div>
        </Link>
    )
}