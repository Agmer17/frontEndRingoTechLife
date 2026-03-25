import { useEffect, useState } from "react"
import { useAdminProducts } from "../../hooks/admin/useAdminProducts"
import ProductListPage from "../../components/shared/ProductList"
import type { Product } from "../../types/product"
import { Link, useNavigate } from "react-router"
import { PlusIcon, Search } from "lucide-react"
import { useToast } from "../../hooks/ui/useToast"
import { Toast } from "../../components/shared/Toast"
import { useProducts } from "../../hooks/products/useProducts"
import ConfirmDialog from "../../components/shared/ConfirmModal"
import { useCategories } from "../../hooks/Category/useCategory"
import type { Category } from "../../types/Category"

export default function AdminProductsIndex() {
    const { getAllProducts, listProducts, deleteProducts, setListProducts } = useAdminProducts()
    const { searchProduct } = useProducts()
    const { getAll: getAllCategories } = useCategories()
    const { toast, dismissToast, showToast } = useToast();
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
    const [cat, setCat] = useState<Category[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllProducts()
            if (!res.success) {
                showToast("error", res.error)
            }
            const catRes = await getAllCategories()
            if (catRes.success) {
                setCat(catRes.data)
            }
        }
        fetchData()
    }, [])


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fireSearch = async (query: string, categorySlug?: string) => {
            const res = await searchProduct(query, categorySlug)

            if (res.success) {
                setListProducts(res.data)
            }
        }

        const fetchData = async () => {
            await getAllProducts()
        }

        if (debouncedSearch !== "" || selectedCategory) {
            fireSearch(
                debouncedSearch,
                selectedCategory?.category_slug
            )
        } else {
            fetchData()
        }
    }, [debouncedSearch, selectedCategory]);

    const onEdit = (product: Product) => {
        navigate(`/admin/products/edit/${product.product_id}`)

    }

    const onDelete = async (product: Product | null) => {

        if (!product) {
            showToast("error", "produk tidak boleh kosong")
            return
        }

        const res = await deleteProducts(product.product_id)
        if (res.success) {
            showToast("success", res.message)
            await getAllProducts()

            setDeleteProduct(null)

        } else {
            showToast("error", res.error)
        }
    }

    return (
        <div className="md:p-6">
            {deleteProduct != null && (
                <ConfirmDialog
                    open={!!deleteProduct}
                    title="Hapus Produk?"
                    message={`Produk "${deleteProduct?.product_name}" akan dihapus.`}
                    confirmText="Hapus"
                    variant="error"
                    onConfirm={() => onDelete(deleteProduct)}
                    onCancel={() => setDeleteProduct(null)}
                />
            )}
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />

            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline">
                    <h2 className="text-2xl font-bold mb-6">Daftar Produk</h2>
                    <h2 className="badge badge-ghost font-medium">
                        {listProducts.length} total
                    </h2>
                </div>

                <div className="w-full flex md:justify-end">
                    <Link to={"/admin/products/add"} className="w-full md:w-[20%]">
                        <button className="btn btn-sm rounded-xl btn-success w-full p-4 text-success-content">
                            <PlusIcon /> {" "} Tambah Produk
                        </button>
                    </Link>
                </div>

                {/* SEARCH */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-[40%]">
                    {/* SEARCH */}
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <Search size={18} className="opacity-60" />
                        <input
                            type="text"
                            className="grow"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

                    {/* CATEGORY SELECT */}
                    <select
                        className="select select-bordered w-full md:w-[50%]"
                        value={selectedCategory?.category_id || ""}
                        onChange={(e) => {
                            const selected = cat.find(c => c.category_id === e.target.value) || null
                            setSelectedCategory(selected)
                        }}
                    >
                        <option value="">Semua Kategori</option>
                        {cat.map((c) => (
                            <option key={c.category_id} value={c.category_id}>
                                {c.category_name}
                            </option>
                        ))}
                    </select>
                </div>


            </div>

            <div className="divider"></div>
            <ProductListPage
                products={listProducts}
                onEdit={onEdit}
                imageBaseUrl={`${import.meta.env.VITE_IMAGE_URL}/products/`}
                onDelete={(product) => setDeleteProduct(product)}
                isAdmin={true}
            />
        </div>
    )
}