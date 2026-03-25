import { useNavigate } from "react-router"
import { ArrowRight, Tag } from "lucide-react"
import type { Product } from "../../../types/product"
import ProductCard from "./ProductCard"
import type { Category } from "../../../types/Category"

interface CategorySectionProps {
    category: Category
    products: Product[]
}

const MAX_VISIBLE = 6

export default function CategorySection({ category, products }: CategorySectionProps) {
    const navigate = useNavigate()
    const visible = products.slice(0, MAX_VISIBLE)

    const handleLihatSemua = () => {
        navigate(`/search?c=${category.category_slug}`)
    }

    if (!products.length) return null

    return (
        <section className="flex px-7 flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                        <Tag size={14} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest leading-none mb-0.5">
                            Kategori
                        </p>
                        <h2 className="text-base font-semibold text-base-content leading-none capitalize">
                            {category.category_name}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={handleLihatSemua}
                    className="flex items-center gap-1 text-xs font-medium text-base-content/50 hover:text-base-content transition-colors"
                >
                    Lihat Semua
                    <ArrowRight size={12} />
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {visible.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                ))}
            </div>

            {/* Lihat Semua Banner */}
            {products.length > MAX_VISIBLE && (
                <button
                    onClick={handleLihatSemua}
                    className="w-full border border-base-200 rounded-xl py-3 text-sm font-medium text-base-content/50 hover:text-base-content bg-base-100 hover:bg-base-200 transition-all flex items-center justify-center gap-2"
                >
                    Lihat semua {category.category_name}
                    <ArrowRight size={14} />
                </button>
            )}

        </section>
    )
}