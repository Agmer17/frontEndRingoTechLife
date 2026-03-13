import { Folder, Package, Pencil, PlusIcon, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { Category, createCategory, UpdateCategoryRequest } from "../../types/Category"
import { Toast } from "../../components/shared/Toast"
import { useToast } from "../../hooks/ui/useToast"
import { useCategories } from "../../hooks/Category/useCategory"
import CategoryModal from "../../components/shared/CategoryFormModal"
import ConfirmDialog from "../../components/shared/ConfirmModal"

export default function AdminCategoryPage() {


    const { getAll, create, deleteCategories, update } = useCategories()
    const [categories, setCategories] = useState<Category[]>([])
    const { toast, dismissToast, showToast } = useToast();

    const [showModal, setShowModal] = useState(false)

    const [confirmModal, setConfirmModal] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAll()

            if (res.success) {
                setCategories(res.data)
            } else {
                showToast("error", res.error)
            }
        }

        fetchCategories()
    }, [])


    const onSubmitCreateCategory = async (data: createCategory) => {
        const res = await create(data)

        if (res.success) {
            showToast("success", res.message)
            const refetchData = await getAll()
            if (refetchData.success) {
                setCategories(refetchData.data)
            }

            setShowModal(false)
        }
    }

    const onDeleteCategory = async (data: Category, id: string) => {
        const res = await deleteCategories(id)
        if (res.success) {
            showToast("success", res.message)
            const refetchData = await getAll()
            if (refetchData.success) {
                setCategories(refetchData.data)
            }

        } else {
            showToast("error", res.error)
        }
        setConfirmModal(false)
        setSelectedCategory(null)
    }

    const onEditSubmit = async (data: UpdateCategoryRequest, id: string) => {
        const res = await update(data, id)
        if (res.success) {
            showToast("success", res.message)
            const refetchData = await getAll()
            if (refetchData.success) {
                setCategories(refetchData.data)
            }

            setShowModal(false)
            setSelectedCategory(null)
        }
    }



    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="operasi Berhasil!"
                errorTitle="operasi Gagal"
            />

            {showModal && (
                <CategoryModal
                    onClose={() => setShowModal(false)}
                    onSubmit={(data: createCategory | UpdateCategoryRequest) => {
                        const newData = data as createCategory

                        onSubmitCreateCategory(newData)
                    }}
                />
            )}

            {showModal && selectedCategory != null && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedCategory(null)
                    }}
                    onSubmit={(data: createCategory | UpdateCategoryRequest,
                        categoryId?: string) => {
                        onEditSubmit(data as UpdateCategoryRequest, categoryId || "")

                        // console.log(data)
                        // console.log(categoryId)
                    }}
                />
            )}

            {confirmModal && selectedCategory != null && (
                <ConfirmDialog
                    open={confirmModal}
                    title={`yakin menghapus kategori ${selectedCategory.category_name}?`}
                    message="produk dengan kategori ini, tidak akan memiliki kategori lagi"
                    onConfirm={() => onDeleteCategory(selectedCategory, selectedCategory.category_id)}
                    onCancel={() => {
                        setSelectedCategory(null)
                        setConfirmModal(false)
                    }}
                />
            )}

            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline">
                    <h2 className="text-2xl font-bold mb-6">Daftar Kategori</h2>
                    <h2 className="badge badge-ghost font-medium">
                        {categories.length} total
                    </h2>
                </div>

                <div className="w-full flex md:justify-end">
                    <button
                        className="w-full md:w-[20%] btn btn-sm rounded-xl btn-success p-4 text-success-content"
                        onClick={() => setShowModal(true)}
                    >
                        <PlusIcon /> {" "} Tambah kategori
                    </button>
                </div>
            </div>

            <div className="divider"></div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <p className="text-sm opacity-60">
                        Belum ada kategori
                    </p>
                </div>
            ) : (

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => (
                        <div
                            key={category.category_id}
                            className="border border-black rounded-xl p-4 flex flex-col gap-3 relative"
                        >

                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-2">

                                <div className="flex items-center gap-2">

                                    {/* ICON */}
                                    <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center">
                                        <Folder size={16} className="opacity-70" />
                                    </div>

                                    <div className="flex flex-col leading-tight">

                                        <span className="text-sm font-semibold">
                                            {category.category_name}
                                        </span>

                                        <span className="text-xs opacity-60">
                                            /{category.category_slug}
                                        </span>

                                    </div>

                                </div>

                                {/* ACTION BUTTON */}
                                <div className="flex gap-1">

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setSelectedCategory(category)
                                            setShowModal(true)
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
                                            setSelectedCategory(category)
                                            setConfirmModal(true)
                                        }}
                                        className="btn btn-ghost btn-xs btn-circle text-error"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-sm leading-relaxed opacity-80">
                                {category.category_description || "Tidak ada deskripsi"}
                            </p>

                            {/* META */}
                            <div className="flex items-center justify-between mt-2">

                                {/* PRODUCT COUNT */}
                                <div className="flex items-center gap-2 text-xs opacity-70">
                                    <Package size={14} />
                                    <span>{category.total_product} produk</span>
                                </div>

                                {/* CREATED DATE */}
                                <span className="text-xs opacity-60">
                                    {new Date(category.category_created_at).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}