import { useState } from "react";
import {
    Smartphone,
    Tag,
    Cpu,
    FileText,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { STATUS_CONFIG, type ServiceRequest, type ServiceRequestStatus } from "../../types/serviceRequest";

interface Props {
    data: ServiceRequest;
    loading?: boolean;

    // role
    isAdmin?: boolean;

    // admin actions
    onQuote?: (payload: {
        quoted_price: number;
        estimated_duration: number;
        admin_note?: string;
    }) => void;

    onRejectByAdmin?: (note: string) => void;

    // user actions
    onUserDecision?: (accept: boolean) => void;
}

const STEP_INDEX: Record<ServiceRequestStatus, number> = {
    pending_review: 0,
    quoted: 1,
    accepted: 2,
    rejected_by_user: 2,
    rejected_by_admin: 2,
    cancelled: 2,
};

function ServiceStepper({ status }: { status: ServiceRequestStatus }) {
    const steps = [
        { key: "review", label: "Review" },
        { key: "quoted", label: "Dikutip" },
        { key: "decision", label: "Keputusan" },
        { key: "done", label: "Selesai" },
    ];

    const active = STEP_INDEX[status];

    const isRejected =
        status === "rejected_by_user" || status === "rejected_by_admin";

    const isCancelled = status === "cancelled";
    const isAccepted = status === "accepted";

    return (
        <div className="px-4 pt-4 pb-5">
            <div className="flex items-start justify-between">
                {steps.map((step, i) => {
                    const isDone = i < active;
                    const isActive = i === active;

                    const isDecisionStep = i === 2;
                    const isCancelHit = isDecisionStep && (isRejected || isCancelled);

                    const circleClass = isCancelHit
                        ? "bg-error border-error text-error-content"
                        : isDone
                            ? "bg-success border-success text-success-content"
                            : isActive
                                ? "bg-info border-info text-info-content"
                                : "bg-base-100 border-base-300 text-base-content/40";

                    const labelClass = isCancelHit
                        ? "text-error"
                        : isDone
                            ? "text-success"
                            : isActive
                                ? "text-info font-semibold"
                                : "text-base-content/40";

                    const lineClass = isDone ? "bg-success" : "bg-base-300";

                    return (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">

                            {/* line */}
                            {i < steps.length - 1 && (
                                <div
                                    className={`absolute top-2.5 left-[55%] h-[1.5px] ${lineClass}`}
                                    style={{ width: "90%" }}
                                />
                            )}

                            {/* circle */}
                            <div
                                className={`w-5.5 h-5.5 rounded-full border-[1.5px] flex items-center justify-center text-[10px] z-10 ${circleClass}`}
                            >
                                {isCancelHit
                                    ? "✕"
                                    : isDone
                                        ? "✓"
                                        : i + 1}
                            </div>

                            {/* label */}
                            <p className={`text-[10px] mt-1.5 text-center ${labelClass}`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

function SectionHeader({ step, title }: { step: string; title: string }) {
    return (
        <div className="border-b border-black px-6 py-3 flex items-center gap-3 bg-base-100">
            <span className="text-xs font-mono border border-black px-2 py-0.5">
                {step}
            </span>
            <h2 className="text-sm font-semibold">{title}</h2>
        </div>
    );
}

function StatusBadge({ label, className }: { label: string; className: string }) {
    return (
        <span className={`badge badge-sm gap-1.5 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

export default function ServiceRequestDetailComponent({ data, loading, isAdmin = false, onQuote, onRejectByAdmin, onUserDecision }: Props) {
    const [index, setIndex] = useState(0);

    const [quotePrice, setQuotePrice] = useState("");
    const [duration, setDuration] = useState("");
    const [note, setNote] = useState("");
    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <span className="loading loading-spinner loading-sm" />
            </div>
        );
    }

    if (!data) return null;

    const images = [data.photo_1, data.photo_2, data.photo_3].filter(
        (p): p is string => !!p
    );

    const baseUrl = `${import.meta.env.VITE_IMAGE_URL}/device_service`;
    const statusCfg = STATUS_CONFIG[data.status];

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* ─── HEADER ───────────────────────── */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">
                            Detail Service
                        </h1>
                        <p className="text-xs text-primary mt-1">
                            Informasi lengkap permintaan service perangkat
                        </p>
                    </div>

                    <StatusBadge
                        label={statusCfg.label}
                        className={statusCfg.badgeClass}
                    />
                </div>

                {/* ─── MAIN CARD ───────────────────────── */}
                <div className="bg-base-100 border border-black">


                    {/* ── 01: Device Info ───────────────── */}
                    <SectionHeader step="01" title="Informasi Perangkat" />

                    <div className="px-6 py-6 space-y-5">

                        {/* Device Type */}
                        <div>
                            <label className="text-xs font-semibold">
                                Device Type
                            </label>
                            <div className="mt-1 border border-black h-10 flex items-center px-3 gap-2 text-sm">
                                <Smartphone size={14} />
                                {data.device_type}
                            </div>
                        </div>

                        {/* Brand & Model */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold">
                                    Brand
                                </label>
                                <div className="mt-1 border border-black h-10 flex items-center px-3 gap-2 text-sm">
                                    <Tag size={13} />
                                    {data.device_brand || "-"}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold">
                                    Model
                                </label>
                                <div className="mt-1 border border-black h-10 flex items-center px-3 gap-2 text-sm">
                                    <Cpu size={13} />
                                    {data.device_model || "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 02: Problem ───────────────── */}
                    <SectionHeader step="02" title="Deskripsi Masalah" />

                    <div className="px-6 py-6">
                        <div className="border border-black p-4 text-sm leading-relaxed flex gap-2">
                            <FileText size={14} className="mt-0.5" />
                            <p>{data.problem_description}</p>
                        </div>
                    </div>

                    {/* ── 03: Photos ───────────────── */}
                    <SectionHeader step="03" title="Foto Perangkat" />

                    <div className="px-6 py-6">

                        {/* Preview */}
                        <div className="mb-4 border border-black relative h-52 bg-base-200 overflow-hidden">
                            <img
                                src={`${baseUrl}/${images[index]}`}
                                className="w-full h-full object-contain"
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setIndex((i) => (i - 1 + images.length) % images.length)
                                        }
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-1"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            setIndex((i) => (i + 1) % images.length)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-1"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}

                            <span className="absolute bottom-2 right-2 text-xs border border-black px-2 py-0.5 bg-base-100">
                                {index + 1}/{images.length}
                            </span>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 flex-wrap">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`w-20 h-20 cursor-pointer overflow-hidden ${i === index
                                        ? "border-2 border-black"
                                        : "border border-black"
                                        }`}
                                >
                                    <img
                                        src={`${baseUrl}/${img}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── 04: Quotation (NEW) ───────────────── */}
                    {(data.quoted_price || data.estimated_duration) && (
                        <>
                            <SectionHeader step="04" title="Penawaran Service" />

                            <div className="px-6 py-6 grid grid-cols-2 gap-4 text-sm">
                                {data.quoted_price && (
                                    <div className="border border-black p-3">
                                        <p className="text-xs text-primary/50">
                                            Harga
                                        </p>
                                        <p className="font-bold">
                                            {formatCurrency(data.quoted_price)}
                                        </p>
                                    </div>
                                )}

                                {data.estimated_duration && (
                                    <div className="border border-black p-3">
                                        <p className="text-xs text-primary/50">
                                            Estimasi
                                        </p>
                                        <p className="font-medium">
                                            {data.estimated_duration} hari
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── 06: Actions ───────────────── */}
                    {(
                        // ADMIN → bisa quote / reject saat pending_review
                        (isAdmin && data.status === "pending_review") ||

                        // USER → bisa decide saat quoted
                        (!isAdmin && data.status === "quoted")
                    ) && (
                            <>
                                <SectionHeader step="06" title="Aksi" />

                                <div className="px-6 py-6 space-y-4">

                                    {/* ─── ADMIN MODE ─── */}
                                    {isAdmin && data.status === "pending_review" && (
                                        <>
                                            {/* Quote Form */}
                                            <div className="border border-black p-4 space-y-3">

                                                <p className="text-sm font-semibold">
                                                    Berikan Penawaran
                                                </p>

                                                <div className="grid grid-cols-2 gap-3">

                                                    <input
                                                        type="number"
                                                        placeholder="Harga"
                                                        value={quotePrice}
                                                        onChange={(e) => setQuotePrice(e.target.value)}
                                                        className="input input-sm rounded-none border border-black"
                                                    />

                                                    <input
                                                        type="number"
                                                        placeholder="Durasi (hari)"
                                                        value={duration}
                                                        onChange={(e) => setDuration(e.target.value)}
                                                        className="input input-sm rounded-none border border-black"
                                                    />
                                                </div>

                                                <textarea
                                                    placeholder="Catatan admin (opsional)"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    className="textarea textarea-sm rounded-none border border-black w-full"
                                                />

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() =>
                                                            onQuote?.({
                                                                quoted_price: Number(quotePrice),
                                                                estimated_duration: Number(duration),
                                                                admin_note: note || undefined,
                                                            })
                                                        }
                                                        className="btn btn-success border border-black rounded-none text-sm h-9"
                                                    >
                                                        Submit Quote
                                                    </button>

                                                    <button
                                                        onClick={() => onRejectByAdmin?.(note)}
                                                        className="btn btn-error border border-black rounded-none text-sm h-9"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ─── USER MODE ─── */}
                                    {!isAdmin && data.status === "quoted" && (
                                        <div className="border border-black p-4 flex flex-col gap-3">

                                            <p className="text-sm">
                                                Apakah anda ingin menerima penawaran ini?
                                            </p>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => onUserDecision?.(true)}
                                                    className="btn btn-success rounded-none border border-black text-sm h-9 flex-1"
                                                >
                                                    Terima
                                                </button>

                                                <button
                                                    onClick={() => onUserDecision?.(false)}
                                                    className="btn btn-error rounded-none border border-black text-sm h-9 flex-1"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    {/* ── 05: Admin Note ───────────────── */}
                    {data.admin_note && (
                        <>
                            <SectionHeader step="05" title="Catatan Admin" />
                            <div className="px-6 py-6">
                                <div className="border border-black p-4 text-sm">
                                    {data.admin_note}
                                </div>
                            </div>
                        </>
                    )}

                    <ServiceStepper status={data.status} />

                    {/* FOOTER */}
                    <div className="border-t border-black px-6 py-4 text-[11px] font-mono text-primary/60 flex flex-col gap-1">
                        <span>ID: {data.id}</span>
                        <span>Created: {formatDate(data.created_at)}</span>
                        <span>Updated: {formatDate(data.updated_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}