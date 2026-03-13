import { Pencil, Star, Trash2, } from "lucide-react";
import type { Product } from "./../../types/product"
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Link } from "react-router";

interface ProductListPageProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    imageBaseUrl?: string; // base URL untuk image, e.g. "https://cdn.example.com/"
    isAdmin?: boolean
}

// Helper format harga
const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);



const statusColor: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "badge badge-soft badge-error",
    draft: "badge badge-soft badge-warning",
    out_of_stock: "bg-orange-100 text-orange-700 border-orange-200",
}

const conditionLabel: Record<string, string> = {
    new: "Baru",
    used: "Bekas",
    refurbished: "Habis Service",
}



// Main Page
export default function ProductListPage({
    products,
    onEdit,
    onDelete,
    imageBaseUrl = "",
    isAdmin = false
}: ProductListPageProps) {

    return (
        <div>
            <div className="card bg-base-100 text-primary">
                <div className="card-body">
                    <div className="flex flex-col gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.product_id}
                                to={
                                    isAdmin
                                        ? `/admin/products/detail/${product.product_slug}`
                                        : `/products/detail/${product.product_slug}`
                                }
                            >
                                <div
                                    key={product.product_id}
                                    className="flex flex-col md:flex-row gap-4 p-4 border border-black rounded-2xl bg-base-100"
                                >
                                    {/* Gambar Carousel */}
                                    <div className="w-full md:w-48 md:shrink-0">
                                        <ProductImageCarousel
                                            images={product.product_images}
                                            productName={product.product_name}
                                            imageBaseUrl={imageBaseUrl}
                                        />
                                    </div>

                                    {/* Info Produk */}
                                    <div className="flex-1 flex flex-col gap-2 min-w-0">

                                        {/* Header: nama + actions */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold capitalize">
                                                    {product.product_name}
                                                </h3>
                                                <p className="text-sm text-base-content/60">
                                                    {product.product_brand} · SKU: {product.product_sku}
                                                </p>
                                            </div>

                                            {isAdmin && (
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            onEdit(product)
                                                        }}
                                                        className="btn btn-ghost btn-sm btn-circle text-warning"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            onDelete(product)
                                                        }}
                                                        className="btn btn-ghost btn-sm btn-circle text-error"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isAdmin && (
                                            <div>
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border capitalize ${statusColor[product.product_status] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {product.product_status}
                                                </span>
                                            </div>
                                        )}

                                        {/* Badges: kategori, kondisi, featured */}
                                        <div className="flex flex-wrap gap-2">
                                            {product.category != null && (

                                                <span className="badge badge-soft text-xs">
                                                    {product.category.category_name}
                                                </span>
                                            )}

                                            <span className="badge badge-soft text-xs capitalize">
                                                {conditionLabel[product.product_condition] ?? product.product_condition}
                                            </span>

                                            {product.product_is_featured && (
                                                <span className="badge badge-warning text-xs gap-1">
                                                    <Star size={12} />
                                                    Unggulan
                                                </span>
                                            )}
                                        </div>

                                        {/* Detail grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-1 text-sm">
                                            <div>
                                                <span className="text-base-content/50">Harga</span>
                                                <p className="font-semibold">
                                                    {formatPrice(product.product_price)}
                                                </p>
                                            </div>
                                            {product.product_weight && (
                                                <div>
                                                    <span className="text-base-content/50">Berat</span>
                                                    <p className="font-semibold">
                                                        {product.product_weight}g
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {products.length === 0 && (
                            <div className="text-center py-16 text-base-content/40">
                                Belum ada produk.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}