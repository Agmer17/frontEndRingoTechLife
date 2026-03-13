import { useEffect, useState } from "react"
import type { createCategory, UpdateCategoryRequest, Category } from "./../../types/Category"

interface CategoryModalProps {
    category?: Category | null
    loading?: boolean
    onClose: () => void
    onSubmit: (
        data: createCategory | UpdateCategoryRequest,
        categoryId?: string
    ) => void
}

export default function CategoryModal({
    category,
    loading = false,
    onClose,
    onSubmit,
}: CategoryModalProps) {

    const [form, setForm] = useState({
        name: "",
        slug: "",
        desc: "",
    })

    useEffect(() => {
        if (category) {
            setForm({
                name: category.category_name,
                slug: category.category_slug,
                desc: category.category_description || "",
            })
        } else {
            setForm({
                name: "",
                slug: "",
                desc: "",
            })
        }
    }, [category])

    const handleSubmit = () => {
        const payload = {
            category_name: form.name,
            category_slug: form.slug,
            category_description: form.desc || undefined,
        }

        if (category) {
            onSubmit(payload as UpdateCategoryRequest, category.category_id)
        } else {
            onSubmit(payload as createCategory)
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box bg-base-100 space-y-4">

                <h3 className="font-semibold text-lg">
                    {category ? "Edit Kategori" : "Tambah Kategori"}
                </h3>

                {/* NAME */}
                <div>
                    <p className="text-sm mb-2 opacity-70">Nama Kategori</p>

                    <input
                        type="text"
                        maxLength={100}
                        className="input input-bordered w-full bg-base-100"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <div className="text-right text-xs opacity-60 mt-1">
                        {form.name.length}/100
                    </div>
                </div>

                {/* SLUG */}
                <div>
                    <p className="text-sm mb-2 opacity-70">Slug</p>

                    <input
                        type="text"
                        maxLength={100}
                        className="input input-bordered w-full bg-base-100"
                        value={form.slug}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                slug: e.target.value,
                            }))
                        }
                    />

                    <div className="text-right text-xs opacity-60 mt-1">
                        {form.slug.length}/100
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <p className="text-sm mb-2 opacity-70">Deskripsi</p>

                    <textarea
                        maxLength={255}
                        className="textarea textarea-bordered w-full bg-base-100"
                        value={form.desc}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                desc: e.target.value,
                            }))
                        }
                    />

                    <div className="text-right text-xs opacity-60 mt-1">
                        {form.desc.length}/255
                    </div>
                </div>

                {/* ACTION */}
                <div className="modal-action">

                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        Batal
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>

                </div>

            </div>
        </div>
    )
}