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

export default function AdminProductsIndex() {
    const { getAllProducts, listProducts, deleteProducts, setListProducts } = useAdminProducts()
    const { searchProduct } = useProducts()
    const { toast, dismissToast, showToast } = useToast();
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllProducts()

            if (!res.success) {
                showToast("error", res.error)
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

    // fire search
    useEffect(() => {
        const fireSearch = async (query: string) => {
            const res = await searchProduct(query)

            if (res.success) {
                setListProducts(res.data)
            }
        }

        const fetchData = async () => {
            await getAllProducts()
        }
        if (debouncedSearch !== "") {
            fireSearch(search)
        } else {
            fetchData()
        }
    }, [debouncedSearch]);

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
                <label className="input input-bordered flex items-center gap-2 w-full md:w-[40%]">
                    <Search size={18} className="opacity-60" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
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