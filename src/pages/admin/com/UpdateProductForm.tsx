import { useRef, useState } from "react";
import {
    Trash2, Sparkles, Package, Wrench, Circle, CheckCircle2, XCircle,
    AlertCircle, Star, StarOff
} from "lucide-react";
import type { Product, UpdateProductRequest } from "../../../types/product";
import type { Category } from "../../../types/Category";

const conditionConfig = {
    new: {
        label: "Baru",
        badge: "badge-success",
        icon: Sparkles
    },
    used: {
        label: "Bekas",
        badge: "badge-warning",
        icon: Package
    },
    refurbished: {
        label: "Habis Service",
        badge: "badge-info",
        icon: Wrench
    }
}

const statusConfig = {
    draft: {
        label: "Draft",
        badge: "badge-ghost",
        icon: Circle
    },
    active: {
        label: "Active",
        badge: "badge-success",
        icon: CheckCircle2
    },
    inactive: {
        label: "Inactive",
        badge: "badge-error",
        icon: XCircle
    },
    out_of_stock: {
        label: "Out of Stock",
        badge: "badge-warning",
        icon: AlertCircle
    }
}



// ─── Image Slot Types ─────────────────────────────────────────────────────────

/**
 * Setiap slot di display images bisa berupa:
 * - "existing"  : gambar dari server, belum diapa-apain
 * - "replaced"  : slot existing yg imagenya dihapus lalu diisi file baru
 * - "empty"     : slot existing yg imagenya dihapus, belum diisi
 * - "new"       : gambar baru yg ditambah via tombol "+"
 */
type ImageSlot =
    | { type: "existing"; imageId: string; previewUrl: string }
    | { type: "empty_replace"; imageId: string }
    | { type: "empty_new" }
    | { type: "replaced"; imageId: string; previewUrl: string; file: File }
    | { type: "new"; previewUrl: string; file: File };

interface Spec {
    key: string;
    value: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpdateProductFormProps {
    product: Product;
    categories: Category[];
    onSubmit: (data: UpdateProductRequest) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdateProductForm({
    product,
    categories,
    onSubmit,
}: UpdateProductFormProps) {

    // ── Form state (pre-filled dari product) ──
    const [form, setForm] = useState<UpdateProductRequest>({
        product_category_id: product.product_category_id,
        product_name: product.product_name,
        product_slug: product.product_slug,
        product_description: product.product_description,
        product_brand: product.product_brand,
        product_condition: product.product_condition as UpdateProductRequest["product_condition"],
        product_sku: product.product_sku,
        product_price: product.product_price,
        product_initial_stock: product.product_stock,
        product_specification: product.product_specification,
        product_status: product.product_status as UpdateProductRequest["product_status"],
        product_featured: product.product_is_featured,
        product_weight: product.product_weight ?? undefined,
    });

    const [priceDisplay, setPriceDisplay] = useState(
        product.product_price
            ? product.product_price.toLocaleString("id-ID")
            : ""
    );

    const [specs, setSpecs] = useState<Spec[]>(
        Object.entries(product.product_specification || {}).map(([key, value]) => ({
            key,
            value,
        })) || [{ key: "", value: "" }]
    );

    const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

    // ── Image state ──
    /**
     * Init: semua gambar dari server jadi slot "existing"
     * diurutkan by display_order
     */
    const [imageSlots, setImageSlots] = useState<ImageSlot[]>(() => {
        const sorted = [...product.product_images]
            .sort((a, b) => a.display_order - b.display_order);

        const slots: ImageSlot[] = sorted.map((img) => ({
            type: "existing",
            imageId: img.id,
            previewUrl: img.image_url,
        }));

        // Isi sisa slot sampai 5 dengan empty_new
        while (slots.length < 5) {
            slots.push({ type: "empty_new" });
        }

        return slots;
    });

    const [primaryIndex, setPrimaryIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /**
     * Ref untuk track slot mana yg lagi "pending upload"
     * ketika file input dibuka dari slot empty atau dari tombol +
     * null = dari tombol + (new image)
     * string = imageId slot empty yg akan di-replace
     */
    const pendingSlotRef = useRef<number | null>(null);

    // ─── Helpers ───────────────────────────────────────────────────────────────

    const updateForm = (key: keyof UpdateProductRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // ─── Image Handlers ────────────────────────────────────────────────────────

    /**
     * Delete existing image → slot jadi "empty"
     * Delete replaced image → slot kembali jadi "empty" (imageId tetap ada)
     * Delete new image → slot hilang
     * Delete empty → tidak valid (tombol tidak muncul)
     */
    const handleDeleteSlot = (index: number) => {
        setImageSlots((prev) => {
            const slot = prev[index];
            const updated = [...prev];

            if (slot.type === "existing") {
                updated[index] = { type: "empty_replace", imageId: slot.imageId };
            } else if (slot.type === "replaced") {
                updated[index] = { type: "empty_replace", imageId: slot.imageId };
            } else if (slot.type === "new") {
                updated[index] = { type: "empty_new" };
            }
            // empty_replace & empty_new tidak ada tombol delete

            return updated;
        });
    };

    /**
     * Buka file input:
     * - Dari slot "empty" → akan replace slot tsb (pendingSlot = imageId)
     * - Dari tombol "+" → gambar baru (pendingSlot = null)
     */
    const openFilePicker = (slotIndex: number) => {
        pendingSlotRef.current = slotIndex;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const targetIndex = pendingSlotRef.current;

        setImageSlots((prev) => {
            const updated = [...prev];
            const slot = updated[targetIndex!];

            if (slot.type === "empty_replace") {
                updated[targetIndex!] = {
                    type: "replaced",
                    imageId: slot.imageId,
                    previewUrl: URL.createObjectURL(files[0]),
                    file: files[0],
                };
            } else if (slot.type === "empty_new") {
                updated[targetIndex!] = {
                    type: "new",
                    previewUrl: URL.createObjectURL(files[0]),
                    file: files[0],
                };
            }

            return updated;
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
        pendingSlotRef.current = null;
    };

    // ─── Spec Handlers ─────────────────────────────────────────────────────────

    const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);

    const updateSpec = (index: number, field: "key" | "value", value: string) => {
        const updated = [...specs];
        updated[index][field] = value;
        setSpecs(updated);
    };

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    // ─── Price Handler ─────────────────────────────────────────────────────────

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw ? Number(raw).toLocaleString("id-ID") : "";
        setPriceDisplay(formatted);
        updateForm("product_price", raw ? Number(raw) : 0);
    };

    // ─── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const specsObject = Object.fromEntries(specs.map((s) => [s.key, s.value]));

        const deletedImageIds: string[] = [];
        const updatedImageIds: string[] = [];
        const updatedImageFiles: File[] = [];
        const newImages: File[] = [];

        imageSlots.forEach((slot) => {
            if (slot.type === "empty_replace") deletedImageIds.push(slot.imageId);
            else if (slot.type === "replaced") {
                updatedImageIds.push(slot.imageId);
                updatedImageFiles.push(slot.file);
            }
            else if (slot.type === "new") newImages.push(slot.file);
            // existing & empty_new → skip
        });

        const data: UpdateProductRequest = {
            ...form,
            product_specification: specsObject,
            product_deleted_image: deletedImageIds,
            product_updated_image_id: updatedImageIds,
            product_updated_image_files: updatedImageFiles,
            product_new_images: newImages,
        };


        console.log(data)
        await onSubmit(data);
    };

    // ─── Derived: preview index hanya dari slot yg visible (non-empty) ──────────
    const primarySlot = imageSlots[primaryIndex];

    let primaryPreviewUrl: string | null = null;

    if (primarySlot && primarySlot.type !== "empty_replace" && primarySlot.type !== "empty_new") {
        primaryPreviewUrl =
            primarySlot.type === "existing"
                ? `${import.meta.env.VITE_IMAGE_URL}/products/${primarySlot.previewUrl}`
                : primarySlot.previewUrl;
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Save button desktop */}
                <div className="w-full hidden md:flex justify-end mb-4">
                    <button type="submit" className="btn btn-success">
                        Simpan Perubahan
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* ── LEFT ── */}
                    <div className="col-span-12 lg:col-span-8 space-y-6 order-2 lg:order-1">

                        {/* General Info */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Informasi Produk</h2>
                            <div className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Nama Produk"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_name || ""}
                                    onChange={(e) => updateForm("product_name", e.target.value)}
                                />
                                {fieldErrors?.product_name && (
                                    <div className="text-error text-sm mt-1">{fieldErrors.product_name}</div>
                                )}

                                <textarea
                                    placeholder="Deskripsi Produk"
                                    className="textarea textarea-bordered border-black w-full focus:outline-none"
                                    rows={4}
                                    value={form.product_description || ""}
                                    onChange={(e) => updateForm("product_description", e.target.value)}
                                />
                                {fieldErrors?.product_description && (
                                    <div className="text-error text-sm mt-1">{fieldErrors.product_description}</div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Brand"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_brand || ""}
                                    onChange={(e) => updateForm("product_brand", e.target.value)}
                                />
                                {fieldErrors?.brand && (
                                    <div className="text-error text-sm mt-1">{fieldErrors.brand}</div>
                                )}

                                <input
                                    type="text"
                                    placeholder="SKU"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_sku || ""}
                                    onChange={(e) => updateForm("product_sku", e.target.value)}
                                />
                                {fieldErrors?.sku && (
                                    <div className="text-error text-sm mt-1">{fieldErrors.sku}</div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Produk slug"
                                    className="input input-bordered border-black w-full focus:outline-none"
                                    value={form.product_slug || ""}
                                    onChange={(e) => updateForm("product_slug", e.target.value)}
                                />
                                {fieldErrors?.slug && (
                                    <div className="text-error text-sm mt-1">{fieldErrors.slug}</div>
                                )}

                            </div>
                        </div>

                        {/* Specification */}
                        <div className="border border-black p-6 rounded-lg">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-lg font-semibold">Spesifikasi Produk</h2>
                                <button type="button" onClick={addSpec} className="btn btn-sm">
                                    Tambah
                                </button>
                            </div>
                            <div className="space-y-3">
                                {specs.map((spec, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={spec.key}
                                            onChange={(e) => updateSpec(index, "key", e.target.value)}
                                            className="input input-bordered border-black w-1/2 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={spec.value}
                                            onChange={(e) => updateSpec(index, "value", e.target.value)}
                                            className="input input-bordered border-black w-1/2 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpec(index)}
                                            className="btn btn-sm btn-ghost text-error px-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Harga Produk</h2>
                            <input
                                type="text"
                                placeholder="Harga (IDR)"
                                className="input input-bordered border-black w-full focus:outline-none"
                                value={priceDisplay}
                                onChange={handlePriceChange}
                            />
                            {fieldErrors?.price && (
                                <div className="text-error text-sm mt-1">{fieldErrors.price}</div>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Jumlah Produk</h2>
                            <input
                                type="number"
                                placeholder="ex: 100"
                                className="input input-bordered border-black w-full focus:outline-none"
                                value={form.product_initial_stock ?? ""}
                                onChange={(e) => updateForm("product_initial_stock", Number(e.target.value))}
                            />
                        </div>

                    </div>

                    {/* ── RIGHT ── */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 order-1 lg:order-2">

                        {/* Image Upload */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Gambar Produk</h2>

                            {/* Primary preview */}
                            <div className="border border-black aspect-square flex items-center justify-center cursor-pointer rounded-lg overflow-hidden bg-gray-50">
                                {primaryPreviewUrl ? (
                                    <img
                                        src={primaryPreviewUrl}
                                        className="w-full h-full object-cover"
                                        alt="primary"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                                )}
                            </div>

                            {/* Thumbnails — render semua slots */}
                            <div className="grid grid-cols-5 gap-3 mt-3">
                                {imageSlots.map((slot, index) => {
                                    if (slot.type === "empty_replace" || slot.type === "empty_new") {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => openFilePicker(index)}
                                                className="aspect-square flex items-center justify-center border border-dashed border-gray-400 cursor-pointer rounded text-xl text-gray-400 hover:border-black transition-colors"
                                            >
                                                +
                                            </div>
                                        );
                                    }

                                    let previewUrl = slot.previewUrl;
                                    if (slot.type === "existing") {
                                        previewUrl = `${import.meta.env.VITE_IMAGE_URL}/products/${slot.previewUrl}`;
                                    }
                                    const isPrimary = index === primaryIndex;

                                    return (
                                        <div key={index} className="relative">
                                            <img
                                                src={previewUrl}
                                                onClick={() => setPrimaryIndex(index)}
                                                className={`aspect-square w-full object-cover border cursor-pointer rounded ${isPrimary ? "border-black border-2" : "border-gray-300"
                                                    }`}
                                                alt={`image-${index}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSlot(index)}
                                                className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <input
                                type="file"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        {/* Category */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Kategori</h2>
                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_category_id || ""}
                                onChange={(e) => updateForm("product_category_id", e.target.value)}
                            >
                                <option value={""}>Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Condition */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Kondisi Produk</h2>

                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_condition || ""}
                                onChange={(e) =>
                                    updateForm(
                                        "product_condition",
                                        e.target.value as UpdateProductRequest["product_condition"]
                                    )
                                }
                            >
                                <option value="">Pilih Kondisi</option>
                                <option value="new">Baru</option>
                                <option value="used">Bekas</option>
                                <option value="refurbished">Habis Service</option>
                            </select>

                            {form.product_condition && (
                                <div className="mt-3">
                                    {(() => {
                                        const cfg = conditionConfig[form.product_condition]
                                        const Icon = cfg.icon
                                        return (
                                            <span className={`badge gap-2 ${cfg.badge}`}>
                                                <Icon size={14} />
                                                {cfg.label}
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="border border-black p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Status Produk</h2>

                            <select
                                className="select select-bordered border-black w-full focus:outline-none"
                                value={form.product_status || ""}
                                onChange={(e) =>
                                    updateForm(
                                        "product_status",
                                        e.target.value as UpdateProductRequest["product_status"]
                                    )
                                }
                            >
                                <option value="">Pilih Status</option>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>

                            {form.product_status && (
                                <div className="mt-3">
                                    {(() => {
                                        const cfg = statusConfig[form.product_status]
                                        const Icon = cfg.icon
                                        return (
                                            <span className={`badge gap-2 ${cfg.badge}`}>
                                                <Icon size={14} />
                                                {cfg.label}
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}
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

                {/* Save button mobile */}
                <div className="w-full flex md:hidden mt-4">
                    <button type="submit" className="btn btn-success w-full">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}