import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { Search, SlidersHorizontal } from "lucide-react"
import type { Product } from "../../types/product"
import { useProducts } from "../../hooks/products/useProducts"
import { useCategories } from "../../hooks/Category/useCategory"
import ProductCard from "./com/ProductCard"
import type { Category } from "../../types/Category"

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { searchProduct } = useProducts()
    const { getAll: getAllCategories } = useCategories()

    const qParam = searchParams.get("q") ?? ""
    const cParam = searchParams.get("c") ?? ""

    const [inputValue, setInputValue] = useState(qParam)
    const [selectedCategory, setSelectedCategory] = useState(cParam)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Fetch categories sekali
    useEffect(() => {
        getAllCategories().then((res) => {
            if (res.success) setCategories(res.data)
        })
    }, [])

    // Fetch products tiap searchParams berubah
    useEffect(() => {
        setInputValue(qParam)
        setSelectedCategory(cParam)

        const fetch = async () => {
            setIsLoading(true)
            const res = await searchProduct(qParam, cParam || undefined)
            if (res.success) setProducts(res.data)
            setIsLoading(false)
        }

        fetch()
    }, [qParam, cParam])

    const applySearch = (q: string, c: string) => {
        const params: Record<string, string> = {}
        if (q.trim()) params.q = q.trim()
        if (c) params.c = c
        setSearchParams(params)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") applySearch(inputValue, selectedCategory)
    }

    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug)
        applySearch(inputValue, slug)
    }

    return (
        <div className="flex flex-col gap-6 p-6">

            {/* ── SEARCH BAR ── */}
            <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body px-5 py-4">
                    <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest mb-3">
                        Cari Produk
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <label className="input input-bordered flex items-center gap-2 flex-1">
                            <Search size={15} className="text-base-content/40 shrink-0" />
                            <input
                                type="text"
                                className="grow text-sm"
                                placeholder="Cari nama produk... (Enter untuk cari)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </label>

                        <select
                            className="select select-bordered text-sm w-full sm:w-48"
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.category_id} value={c.category_slug}>
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active filters */}
                    {(qParam || cParam) && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <SlidersHorizontal size={12} className="text-base-content/40" />
                                {qParam && (
                                    <span className="badge badge-sm bg-base-200 border-0 text-base-content/60">
                                        "{qParam}"
                                    </span>
                                )}
                                {cParam && (
                                    <span className="badge badge-sm bg-base-200 border-0 text-base-content/60 capitalize">
                                        {categories.find(c => c.category_slug === cParam)?.category_name ?? cParam}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setInputValue("")
                                    setSelectedCategory("")
                                    setSearchParams({})
                                }}
                                className="text-xs text-base-content/40 hover:text-base-content transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── RESULTS ── */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-base-200 overflow-hidden">
                            <div className="aspect-square w-full bg-base-200 animate-pulse" />
                            <div className="p-3 flex flex-col gap-2">
                                <div className="h-3 bg-base-200 rounded animate-pulse w-1/2" />
                                <div className="h-3 bg-base-200 rounded animate-pulse w-full" />
                                <div className="h-3 bg-base-200 rounded animate-pulse w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <>
                    <p className="text-xs text-base-content/40 px-0.5">
                        {products.length} produk ditemukan
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.map((product) => (
                            <ProductCard key={product.product_id} product={product} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="card bg-base-100 border border-base-200 shadow-none">
                    <div className="card-body items-center py-16 text-center">
                        <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                            <Search size={18} />
                        </div>
                        <p className="text-sm font-medium text-base-content/50">
                            Produk tidak ditemukan
                        </p>
                        <p className="text-xs text-base-content/30 mt-0.5">
                            Coba kata kunci atau kategori yang berbeda
                        </p>
                    </div>
                </div>
            )}

        </div>
    )
}