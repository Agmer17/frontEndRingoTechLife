import React, { useState, useMemo } from "react"
import { Star, Boxes, Weight, Calendar, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Trash2, Pencil, UserIcon } from "lucide-react"
import type { ProductDetailResponse } from "../../types/product"
import AddReviewModal from "./AddReviewFormModal";
import type { CreateReviewRequest, Review, UpdateReviewRequest } from "../../types/review";
import UpdateReviewModal from "./UpdateReviewModal";


interface Props {
    product: ProductDetailResponse
    imageBaseUrl: string
    isAdmin?: boolean
    onSubmitReview: (data: CreateReviewRequest) => void
    showReviewForm: boolean
    setShowReviewForm: (k: boolean) => void
    currentUserId: string

    onDeleteReview: (review: Review) => void
    onEdit: (newData: UpdateReviewRequest, id: string) => void

    editFormReview: boolean
    setEditFormReview: (b: boolean) => void

    onSubmitEdit: (data: UpdateReviewRequest, id: string) => void
}


const conditionLabel: Record<string, string> = {
    new: "Baru",
    used: "Bekas",
    refurbished: "Habis Service",
}

const statusColor: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-gray-100 text-gray-600 border-black",
    out_of_stock: "bg-orange-100 text-orange-700 border-orange-200",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductDetail({
    product,
    imageBaseUrl,
    onSubmitReview,
    showReviewForm,
    setShowReviewForm,
    currentUserId,
    isAdmin = false,
    onDeleteReview,
    editFormReview,
    setEditFormReview,
    onSubmitEdit

}: Props) {


    const sortedImages = useMemo(() =>
        [...product.product_images].sort((a, b) => a.display_order - b.display_order),
        [product.product_images]
    )

    const [primaryIndex, setPrimaryIndex] = useState(0)
    const [sort, setSort] = useState<"highest" | "lowest">("highest")

    const primaryImage = sortedImages[primaryIndex]
    const primaryUrl = primaryImage ? `${imageBaseUrl}/${primaryImage.image_url}` : null

    const isEverReview = product.reviews.some(
        review => review.user.user_id === currentUserId
    )

    const [selectedReview, setSelectedReview] = useState<Review | null>(null)

    const avgRating = useMemo(() => {
        if (!product.reviews.length) return 0
        return product.reviews.reduce((acc, r) => acc + r.review_rating, 0) / product.reviews.length
    }, [product.reviews])

    const sortedReviews = useMemo(() => {
        return [...product.reviews].sort((a, b) =>
            sort === "highest"
                ? b.review_rating - a.review_rating
                : a.review_rating - b.review_rating
        )
    }, [product.reviews, sort])

    const handlePrev = () => setPrimaryIndex(i => Math.max(0, i - 1))
    const handleNext = () => setPrimaryIndex(i => Math.min(sortedImages.length - 1, i + 1))

    const renderStars = (rating: number, size = 16) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                />
            ))}
        </div>
    )

    const ratingDist = useMemo(() => {
        const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        product.reviews.forEach(r => dist[r.review_rating] = (dist[r.review_rating] || 0) + 1)
        return dist
    }, [product.reviews])

    const onReviewBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowReviewForm(true)
    }

    return (

        <div className="flex flex-col gap-5 max-w-6xl mx-auto">

            {showReviewForm && (
                <AddReviewModal
                    open={showReviewForm}
                    onClose={() => setShowReviewForm(false)}
                    loading={false}
                    onSubmit={(data) => {
                        const newReview: CreateReviewRequest = {
                            product_id: product.product_id,
                            rating: data.rating,
                            comment: data.comment
                        }
                        onSubmitReview(newReview)
                    }
                    }
                />
            )}

            {(editFormReview && (selectedReview != null)) && (
                <UpdateReviewModal
                    review={selectedReview}
                    onClose={() => {
                        setShowReviewForm(false)
                        setSelectedReview(null)
                    }}
                    onSubmit={(data) => {
                        onSubmitEdit(data, selectedReview.review_id)
                    }}
                />
            )}
            {/* ── MAIN CARD ── */}
            <div className="bg-white border border-black rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">

                    {/* ── IMAGE SECTION ── */}
                    <div className="lg:w-105 shrink-0 p-5 flex flex-col gap-3 border-b lg:border-b-0 lg:border-r border-gray-100">

                        {/* Primary image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                            {primaryUrl ? (
                                <img
                                    src={primaryUrl}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                    Tidak ada gambar
                                </div>
                            )}

                            {/* Nav arrows */}
                            {sortedImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        disabled={primaryIndex === 0}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-black flex items-center justify-center hover:bg-white disabled:opacity-30 transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={primaryIndex === sortedImages.length - 1}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-black flex items-center justify-center hover:bg-white disabled:opacity-30 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            {sortedImages.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                                    {primaryIndex + 1}/{sortedImages.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-5 gap-2">
                            {sortedImages.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setPrimaryIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === primaryIndex
                                        ? "border-black scale-95"
                                        : "border-transparent hover:border-gray-300"
                                        }`}
                                >
                                    <img
                                        src={`${imageBaseUrl}/${img.image_url}`}
                                        alt={`thumbnail-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* ── INFO SECTION ── */}
                    <div className="flex-1 p-6 flex flex-col gap-4">

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-black">
                                {product.category.category_name}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-black capitalize">
                                {conditionLabel[product.product_condition] ?? product.product_condition}
                            </span>
                            {isAdmin && (
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusColor[product.product_status] ?? "bg-gray-100 text-gray-600"}`}>
                                    {product.product_status}
                                </span>
                            )}
                            {product.product_is_featured && (
                                <span className="badge badge-warning text-xs gap-1">
                                    <Star size={12} />
                                    Unggulan
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-snug capitalize">
                                {product.product_name}
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                {product.product_brand} &nbsp;·&nbsp; SKU: {product.product_sku}
                            </p>
                        </div>

                        {/* Rating summary */}
                        {product.reviews.length > 0 && (
                            <div className="flex items-center gap-2">
                                {renderStars(Math.round(avgRating), 14)}
                                <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
                                <span className="text-sm text-gray-400">({product.reviews.length} ulasan)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="py-3 border-y border-gray-100">
                            <p className="text-3xl font-bold text-gray-900">
                                Rp {product.product_price.toLocaleString("id-ID")}
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="flex items-start gap-2">
                                <Boxes size={16} className="mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400">Stok</p>
                                    <p className="text-sm font-semibold text-gray-800">{product.product_stock} pcs</p>
                                </div>
                            </div>
                            {product.product_weight && (
                                <div className="flex items-start gap-2">
                                    <Weight size={16} className="mt-0.5 text-gray-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Berat</p>
                                        <p className="text-sm font-semibold text-gray-800">{product.product_weight} g</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <Calendar size={16} className="mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400">Ditambahkan</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {new Date(product.product_created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            {[
                                { icon: ShieldCheck, label: "Produk Terjamin" },
                                { icon: Truck, label: "Pengiriman Cepat" },
                                { icon: RotateCcw, label: "Retur Mudah" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Icon size={14} className="text-gray-400" />
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {product.product_description && (
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</p>
                                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                    {product.product_description}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ── SPECIFICATION ── */}
            {product.product_specification && Object.keys(product.product_specification).length > 0 && (
                <div className="bg-white border border-black rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900">Spesifikasi Produk</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {Object.entries(product.product_specification).map(([key, value], i) => (
                            <div
                                key={key}
                                className={`flex text-sm px-6 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                            >
                                <div className="w-2/5 text-gray-400 font-medium capitalize">{key}</div>
                                <div className="flex-1 text-gray-700">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── REVIEWS ── */}
            <div className="bg-white border border-black rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Ulasan Pembeli</h2>
                    <select
                        className="select select-bordered select-sm border-black focus:outline-none text-sm"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as "highest" | "lowest")}
                    >
                        <option value="highest">Rating Tertinggi</option>
                        <option value="lowest">Rating Terendah</option>
                    </select>
                </div>
                {!isEverReview && product.reviews.length != 0 && (
                    <div className="flex w-full px-6 justify-end">
                        <button className="btn btn-primary"
                            onClick={onReviewBtnClick}>
                            Tambah Review
                        </button>
                    </div>
                )}

                {product.reviews.length > 0 && (
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                        {/* Big score */}
                        <div className="text-center shrink-0">
                            <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                            {renderStars(Math.round(avgRating), 20)}
                            <p className="text-xs text-gray-400 mt-1">{product.reviews.length} ulasan</p>
                        </div>

                        {/* Distribution bars */}
                        <div className="flex-1 w-full flex flex-col gap-1.5">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = ratingDist[star] || 0
                                const pct = product.reviews.length ? (count / product.reviews.length) * 100 : 0
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="w-3 text-right">{star}</span>
                                        <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-4 text-right">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="divide-y divide-gray-50">
                    {sortedReviews.map(review => (
                        <div key={review.review_id} className="px-6 py-4 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                                        {review.user.user_profile_picture ? (
                                            <img
                                                src={`${import.meta.env.VITE_IMAGE_URL}/user/${review.user.user_profile_picture}`}
                                                alt={review.user.user_fullname}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="opacity-50" />
                                        )}
                                    </div>
                                    <p className="text-primary text-sm">
                                        {review.user.user_fullname}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.review_created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {(isAdmin || currentUserId === review.user.user_id) && (
                                        <div className="flex gap-2 shrink-0">

                                            {currentUserId === review.user.user_id && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        setEditFormReview(true)
                                                        setSelectedReview(review)
                                                    }}
                                                    className="btn btn-ghost btn-sm btn-circle text-warning"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    onDeleteReview(review)
                                                }}
                                                className="btn btn-ghost btn-sm btn-circle text-error"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {renderStars(review.review_rating, 13)}

                            {review.review_comment && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {review.review_comment}
                                </p>
                            )}
                        </div>
                    ))}

                    {sortedReviews.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-14 text-center gap-4">
                            <p className="text-gray-400 text-sm">
                                Belum ada ulasan untuk produk ini
                            </p>
                            <div className="btn btn-circle btn-lg btn-warning text-white">
                                <Star size={30} />
                            </div>
                            <button
                                className="btn btn-outline btn-primary btn-md"
                                onClick={onReviewBtnClick}
                            >
                                Tambah Review
                            </button>

                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}