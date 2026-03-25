import { useRef } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import type { Product } from "../../../types/product"
import ProductCard from "./ProductCard"

interface BestSellerSectionProps {
    products: Product[]
}

export default function BestSellerSection({ products }: BestSellerSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({
            left: dir === "left" ? -320 : 320,
            behavior: "smooth",
        })
    }

    if (!products.length) return null

    return (
        <section className="flex px-7 flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                        <TrendingUp size={14} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest leading-none mb-0.5">
                            Terlaris
                        </p>
                        <h2 className="text-base font-semibold text-base-content leading-none">
                            Best Seller
                        </h2>
                    </div>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => scroll("left")}
                        className="w-7 h-7 rounded-lg border border-base-200 bg-base-100 hover:bg-base-200 flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-7 h-7 rounded-lg border border-base-200 bg-base-100 hover:bg-base-200 flex items-center justify-center transition-colors"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
            >
                {products.map((product) => (
                    <div
                        key={product.product_id}
                        className="snap-start shrink-0 w-40 sm:w-44"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

        </section>
    )
}