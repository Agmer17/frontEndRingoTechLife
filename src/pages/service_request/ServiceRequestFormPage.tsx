import { useState, useRef } from "react";
import {
    Smartphone,
    Tag,
    Cpu,
    FileText,
    ImagePlus,
    X,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
} from "lucide-react";
import type { CreateServiceRequestDTO } from "../../types/serviceRequest";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import useServiceRequest from "../../hooks/service_request/useServiceRequest";

// ─── DTO Interface ────────────────────────────────────────────────────────────

interface FormState {
    device_type: string;
    device_brand: string;
    device_model: string;
    problem_description: string;
}

interface FormErrors {
    device_type?: string;
    device_brand?: string;
    device_model?: string;
    problem_description?: string;
}

interface ImageEntry {
    file: File;
    url: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
    device_type: "",
    device_brand: "",
    device_model: "",
    problem_description: "",
};

const MAX_IMAGES = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
    const errors: FormErrors = {};

    if (!form.device_type.trim())
        errors.device_type = "Device type is required.";
    else if (form.device_type.length > 100)
        errors.device_type = "Max 100 characters.";

    if (form.device_brand && form.device_brand.length > 100)
        errors.device_brand = "Max 100 characters.";

    if (form.device_model && form.device_model.length > 150)
        errors.device_model = "Max 150 characters.";

    if (!form.problem_description.trim())
        errors.problem_description = "Problem description is required.";

    return errors;
}

function buildDTO(form: FormState, images: ImageEntry[]): CreateServiceRequestDTO {
    return {
        device_type: form.device_type.trim(),
        device_brand: form.device_brand.trim() || undefined,
        device_model: form.device_model.trim() || undefined,
        problem_description: form.problem_description.trim(),
        device_image: images.map((i) => i.file),
    };
}


function SectionHeader({ step, title }: { step: string; title: string }) {
    return (
        <div className="border-b border-black px-6 py-4 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                {step}
            </span>
            <span className="text-primary text-xs">—</span>
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                {title}
            </span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateServiceRequestForm() {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [images, setImages] = useState<ImageEntry[]>([]);
    const [activePreview, setActivePreview] = useState<number>(0);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const { toast, dismissToast, showToast } = useToast();
    const { createNew } = useServiceRequest()

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files ?? []);
        const slots = MAX_IMAGES - images.length;
        const entries: ImageEntry[] = files.slice(0, slots).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages((prev) => {
            const next = [...prev, ...entries];
            setActivePreview(next.length - 1);
            return next;
        });
        e.target.value = "";
    };

    const removeImage = (idx: number): void => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[idx].url);
            const next = prev.filter((_, i) => i !== idx);
            setActivePreview(Math.min(activePreview, Math.max(next.length - 1, 0)));
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length > 0) {
            showToast("error", "harap isi data dengan benar!")
            setErrors(errs);
            return;
        }
        const dto: CreateServiceRequestDTO = buildDTO(form, images);

        const res = await createNew(dto)


        if (res.success) {
            showToast("success", res.message)
            setSubmitted(true);
        } else {
            showToast("error", res.error)
        }
    };

    const reset = (): void => {
        images.forEach((img) => URL.revokeObjectURL(img.url));
        setForm(INITIAL_FORM);
        setImages([]);
        setActivePreview(0);
        setErrors({});
        setSubmitted(false);
    };

    // ── Success State ──────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <Toast
                    toast={toast}
                    onDismiss={dismissToast}
                    successTitle="Update Berhasil!"
                    errorTitle="Update Gagal"
                />
                <div className="bg-white border border-black max-w-md w-full p-10 text-center">
                    <CheckCircle
                        className="mx-auto mb-5 text-success"
                        size={48}
                        strokeWidth={1.5}
                    />
                    <h2 className="text-2xl font-bold mb-2">Permintaan Terkirim</h2>
                    <p className="text-primary text-sm mb-8 leading-relaxed">
                        Permintaan service kamu telah diterima! Tim kami akan segeran mengecek dan memverifikasi harap tunggu sebentar
                    </p>
                    <button
                        onClick={reset}
                        className="btn btn-neutral rounded-none w-full border border-black"
                    >
                        Kirim permintaan lain
                    </button>
                </div>
            </div>
        );
    }

    // ── Form ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Service Elektronik
                    </h1>
                    <p className="text-sm text-primary mt-1">
                        Harap isi data dan masalah perangkat anda dengan detail
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="bg-base-100 border border-black"
                >

                    {/* ── 01: Device Information ────────────────────────────────────── */}

                    <SectionHeader step="01" title="Informasi Perangkat" />

                    <div className="px-6 py-6 space-y-5">

                        {/* Device Type — free text input */}
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">
                                Device Type <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                                    <Smartphone size={15} strokeWidth={1.5} />
                                </span>
                                <input
                                    type="text"
                                    name="device_type"
                                    value={form.device_type}
                                    onChange={handleChange}
                                    placeholder="contoh Smartphone, Laptop, Printer..."
                                    maxLength={100}
                                    className={`input input-sm w-full pl-9 rounded-none border border-black focus:outline-none focus:border-black text-sm h-10 ${errors.device_type ? "border-error" : ""
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Brand & Model — 2 column */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">
                                    Brand
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                                        <Tag size={14} strokeWidth={1.5} />
                                    </span>
                                    <input
                                        type="text"
                                        name="device_brand"
                                        value={form.device_brand}
                                        onChange={handleChange}
                                        placeholder="contoh Samsung"
                                        maxLength={100}
                                        className={`input input-sm w-full pl-9 rounded-none border border-black focus:outline-none focus:border-black text-sm h-10 ${errors.device_brand ? "border-error" : ""
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">
                                    Model
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                                        <Cpu size={14} strokeWidth={1.5} />
                                    </span>
                                    <input
                                        type="text"
                                        name="device_model"
                                        value={form.device_model}
                                        onChange={handleChange}
                                        placeholder="contoh Galaxy S24"
                                        maxLength={150}
                                        className={`input input-sm w-full pl-9 rounded-none border border-black focus:outline-none focus:border-black text-sm h-10 ${errors.device_model ? "border-error" : ""
                                            }`}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── 02: Problem Description ───────────────────────────────────── */}

                    <SectionHeader step="02" title="Deskripsi masalah perangkat" />

                    <div className="px-6 py-6">
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-primary pointer-events-none">
                                <FileText size={14} strokeWidth={1.5} />
                            </span>
                            <textarea
                                name="problem_description"
                                value={form.problem_description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Jelaskan masalah perngkat secara detail seperti : Layar tidak menyala, baterai cepat habis, tida bisa dicas..."
                                className={`textarea w-full pl-9 rounded-none border border-black focus:outline-none focus:border-black text-sm resize-none leading-relaxed ${errors.problem_description ? "border-error" : ""
                                    }`}
                            />
                        </div>
                    </div>

                    {/* ── 03: Device Photos ─────────────────────────────────────────── */}

                    <SectionHeader step="03" title="Foto Perangkat" />
                    <div className="px-6 py-6">
                        <p className="text-xs text-primary mb-4">
                            Maksimal gambar adalah {MAX_IMAGES}. Klik gambar untuk melihat preview.
                        </p>

                        {/* Large preview */}
                        {images.length > 0 && (
                            <div
                                className="mb-4 border border-black relative overflow-hidden bg-base-200"
                                style={{ height: 240 }}
                            >
                                <img
                                    src={images[activePreview]?.url}
                                    alt={`device-preview-${activePreview}`}
                                    className="w-full h-full object-contain"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActivePreview(
                                                    (p) => (p - 1 + images.length) % images.length
                                                )
                                            }
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-1 hover:bg-base-200 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActivePreview((p) => (p + 1) % images.length)
                                            }
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-1 hover:bg-base-200 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </>
                                )}

                                <span className="absolute bottom-2 right-3 text-xs bg-base-100 border border-black px-2 py-0.5">
                                    {activePreview + 1} / {images.length}
                                </span>
                            </div>
                        )}

                        {/* Thumbnails + upload slot */}
                        <div className="flex gap-3 items-center flex-wrap">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActivePreview(idx)}
                                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden ${activePreview === idx
                                        ? "border-2 border-black"
                                        : "border border-black"
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`device-thumb-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(idx);
                                        }}
                                        className="absolute top-0.5 right-0.5 bg-base-100 border border-black p-0.5 hover:bg-error hover:text-error-content transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}

                            {images.length < MAX_IMAGES && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-20 border border-black border-dashed flex flex-col items-center justify-center gap-1 hover:bg-base-200 transition-colors flex-shrink-0"
                                >
                                    <ImagePlus
                                        size={18}
                                        strokeWidth={1.5}
                                        className="text-primary"
                                    />
                                    <span className="text-xs text-primary">
                                        {MAX_IMAGES - images.length} left
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Hidden file input — name matches DTO field */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="device_image"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* ── Footer ────────────────────────────────────────────────────── */}

                    <div className="border-t border-black px-6 py-5 flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <p className="text-xs text-primary">
                            Fields marked <span className="text-error">*</span> are required.
                        </p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={reset}
                                className="btn btn-ghost rounded-none border border-black flex-1 sm:flex-none text-sm h-10 min-h-0"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="btn btn-neutral rounded-none border border-black flex-1 sm:flex-none text-sm h-10 min-h-0"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>

                </form>

                <p className="text-center text-xs text-primary mt-6">
                    Proses verifikasi dapat memakan waktu hingga 3 hari
                </p>
            </div>
        </div>
    );
}