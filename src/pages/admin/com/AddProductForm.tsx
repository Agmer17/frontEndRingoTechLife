import { useEffect, useRef, useState } from "react"
import { ProducterrorKeyMap, type CreateProductRequest } from "../../../types/product"
import { useAdminProducts } from "../../../hooks/admin/useAdminProducts"
import { useToast } from "../../../hooks/ui/useToast"
import { Toast } from "../../../components/shared/Toast"
import { useNavigate } from "react-router"
import { useAdminCategories } from "../../../hooks/admin/useAdminCategories"
import { Star, StarOff } from "lucide-react"

type Spec = {
    key: string
    value: string
}

export default function ProductForm() {

    const updateForm = (key: keyof CreateProductRequest, value: any) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [primaryIndex, setPrimaryIndex] = useState(0)
    const { createProducts } = useAdminProducts()
    const { toast, dismissToast, showToast } = useToast();
    const [specs, setSpecs] = useState<Spec[]>([
        { key: "", value: "" }
    ])
    const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)

    const { getAllCategories, categories } = useAdminCategories()


    useEffect(() => {
        const fetchCat = async () => {
            await getAllCategories()
        }
        fetchCat()
    }, [])

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const [form, setForm] = useState<CreateProductRequest>({
        product_category_id: "",
        product_name: "",
        product_slug: "",
        product_description: "",
        product_brand: "",
        product_condition: "new",
        product_sku: "",
        product_price: 0,
        product_initial_stock: 0,
        product_specification: {},
        product_status: "draft",
        product_featured: false,
        product_weight: undefined,
        product_images: []
    });

    const [priceDisplay, setPriceDisplay] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = Array.from(e.target.files || [])

        if (files.length === 0) return

        const total = images.length + files.length

        if (total > 5) {
            alert("Maksimal 5 gambar")
            return
        }

        const newImages = [...images, ...files]
        setImages(newImages)

        updateForm("product_images", newImages)

        const newPreviews = files.map(file => URL.createObjectURL(file))
        setPreviewImages(prev => [...prev, ...newPreviews])
    }

    const removeImage = (index: number) => {

        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = previewImages.filter((_, i) => i !== index)

        setImages(newImages)
        setPreviewImages(newPreviews)

        updateForm("product_images", newImages)

        if (primaryIndex === index) {
            setPrimaryIndex(0)
        } else if (primaryIndex > index) {
            setPrimaryIndex(primaryIndex - 1)
        }
    }

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }])
    }

    const updateSpec = (index: number, field: "key" | "value", value: string) => {

        const updated = [...specs]
        updated[index][field] = value

        setSpecs(updated)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const specsObject = Object.fromEntries(
            specs.map(s => [s.key, s.value])
        );


        const data: CreateProductRequest = {
            ...form,
            product_specification: specsObject,
            product_images: images
        };


        const response = await createProducts(data)

        if (response.success) {
            showToast("success", response.message)
            setTimeout(() => {
                navigate("/admin/products/")
            }, 1000)
        } else {
            if (typeof response.error == "string") {
                showToast("error", response.error)
            } else if (typeof response.error == "object") {
                const mappedErrors: Record<string, string> = {}
                Object.entries(response.error).forEach(([key, value]) => {
                    const mappedKey = ProducterrorKeyMap[key]
                    if (mappedKey) {
                        mappedErrors[mappedKey] = String(value)
                    }
                })

                setFieldErrors(mappedErrors)

                showToast("error", mappedErrors)
            }
        }


    };

    // const [price, setPrice] = useState("");

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const raw = e.target.value.replace(/\D/g, "");

        const formatted = raw
            ? Number(raw).toLocaleString("id-ID")
            : "";

        setPriceDisplay(formatted);

        updateForm("product_price", raw ? Number(raw) : 0);
    };


    return (
        <div>
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            <form onSubmit={handleSubmit}>
                <div className="w-full hidden md:flex justify-end mb-4">
                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Simpan Produk
                    </button>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    {/* LEFT SIDE */}
                    <div className="col-span-12 lg:col-span-8 space-y-6 order-2 lg:order-1">

                        {/* GENERAL INFO */}
                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Informasi Produk
                            </h2>

                            <div className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Nama Produk"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_name}
                                    onChange={(e) => updateForm("product_name", e.target.value)}
                                />
                                {fieldErrors?.product_name && (
                                    <div className="text-error text-sm mt-1">
                                        {fieldErrors.product_name}
                                    </div>
                                )}

                                <textarea
                                    placeholder="Deskripsi Produk"
                                    className="textarea textarea-bordered border-black w-full focus:outline-none"
                                    rows={4}
                                    value={form.product_description || ""}
                                    onChange={(e) => updateForm("product_description", e.target.value)}
                                />
                                {fieldErrors?.product_description && (
                                    <div className="text-error text-sm mt-1">
                                        {fieldErrors.product_description}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Brand"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_brand || ""}
                                    onChange={(e) => updateForm("product_brand", e.target.value)}
                                />
                                {fieldErrors?.brand && (
                                    <div className="text-error text-sm mt-1">
                                        {fieldErrors.brand}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="SKU"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_sku}
                                    onChange={(e) => updateForm("product_sku", e.target.value)}
                                />
                                {fieldErrors?.sku && (
                                    <div className="text-error text-sm mt-1">
                                        {fieldErrors.sku}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="produk slug"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_slug}
                                    onChange={(e) => updateForm("product_slug", e.target.value)}
                                />
                                {fieldErrors?.slug && (
                                    <div className="text-error text-sm mt-1">
                                        {fieldErrors.slug}
                                    </div>
                                )}

                            </div>

                        </div>

                        {/* SPECIFICATION */}
                        <div className="border border-black p-6 rounded-lg">

                            <div className="flex justify-between mb-4">

                                <h2 className="text-lg font-semibold">
                                    Spesifikasi Produk
                                </h2>

                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="btn btn-sm"
                                >
                                    Tambah
                                </button>

                            </div>

                            <div className="space-y-3">

                                {specs.map((spec, index) => (

                                    <div key={index} className="flex gap-3">

                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={spec.key}
                                            onChange={(e) =>
                                                updateSpec(index, "key", e.target.value)
                                            }
                                            className="input input-bordered border-black w-1/2 focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={spec.value}
                                            onChange={(e) =>
                                                updateSpec(index, "value", e.target.value)
                                            }
                                            className="input input-bordered border-black w-1/2 focus:outline-none"
                                        />

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* PRICE */}
                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Harga Produk
                            </h2>

                            <input
                                type="text"
                                placeholder="Harga (IDR)"
                                className="input input-bordered border-black w-full focus:outline-none"
                                value={priceDisplay}
                                onChange={handlePriceChange}
                            />
                            {fieldErrors?.price && (
                                <div className="text-error text-sm mt-1">
                                    {fieldErrors.price}
                                </div>
                            )}

                        </div>
                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Jumlah produk
                            </h2>

                            <input
                                type="number"
                                placeholder="ex : 100"
                                className="input input-bordered border-black w-full focus:outline-none"
                                value={form.product_initial_stock}
                                onChange={(e) => updateForm("product_initial_stock", e.target.value)}
                            />
                            {fieldErrors?.price && (
                                <div className="text-error text-sm mt-1">
                                    {fieldErrors.price}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 order-1 lg:order-2">

                        {/* IMAGE UPLOAD */}
                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Gambar Produk
                            </h2>

                            {/* PRIMARY IMAGE */}
                            <div
                                className="border border-black aspect-square flex items-center justify-center cursor-pointer rounded-lg overflow-hidden"
                                onClick={handleImageClick}
                            >

                                {previewImages.length > 0 ? (
                                    <img
                                        src={previewImages[primaryIndex]}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>Upload Image</span>
                                )}

                            </div>

                            {/* THUMBNAILS */}
                            <div className="grid grid-cols-5 gap-3 mt-3">

                                {previewImages.map((img, index) => (

                                    <div key={index} className="relative">

                                        <img
                                            src={img}
                                            onClick={() => setPrimaryIndex(index)}
                                            className={`aspect-square w-full object-cover border cursor-pointer rounded 
                ${primaryIndex === index ? "border-black" : "border-gray-300"}`}
                                        />

                                        {/* DELETE BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 text-xs rounded-full flex items-center justify-center"
                                        >
                                            ✕
                                        </button>

                                    </div>

                                ))}

                                {/* ADD IMAGE */}
                                {previewImages.length < 5 && (

                                    <div
                                        onClick={handleImageClick}
                                        className="aspect-square flex items-center justify-center border border-black cursor-pointer rounded text-xl"
                                    >
                                        +
                                    </div>

                                )}

                            </div>

                            <input
                                type="file"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                        </div>

                        {/* CATEGORY */}
                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Kategori
                            </h2>

                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_category_id}
                                onChange={(e) => updateForm("product_category_id", e.target.value)}
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option
                                        key={cat.category_id}
                                        value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="border border-black p-6 rounded-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Kondisi Produk
                            </h2>

                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_condition}
                                onChange={(e) => updateForm("product_condition", e.target.value)}
                            >
                                <option value="">Pilih Kondisi</option>
                                <option value="new">baru</option>
                                <option value="used">bekas</option>
                                <option value="refurbished">habis service</option>
                            </select>

                        </div>
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Status Produk</h2>
                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_status || ""}
                                onChange={(e) => updateForm("product_status", e.target.value)}
                            >
                                <option value="">Pilih Status</option>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Featured Product</h2>

                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Tampilkan sebagai produk unggulan</span>

                                <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={form.product_featured ?? false}
                                    onChange={(e) =>
                                        updateForm("product_featured", e.target.checked)
                                    }
                                />
                            </label>

                            <div className="mt-3">
                                {form.product_featured ? (
                                    <span className="badge badge-warning gap-2">
                                        <Star size={14} />
                                        Featured
                                    </span>
                                ) : (
                                    <span className="badge badge-ghost gap-2">
                                        <StarOff size={14} />
                                        Not Featured
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full flex md:hidden md:justify-end mt-4">
                    <button
                        type="submit"
                        className="btn btn-success w-full"
                    >
                        Simpan Produk
                    </button>
                </div>

            </form>
        </div>
    )
}