import { useState } from "react";
import {
    Smartphone,
    Clock,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    Search,
} from "lucide-react";
import {
    type ServiceRequest,
    type ServiceRequestStatus,
    STATUS_CONFIG,
    ALL_STATUSES,
} from "./../../types/serviceRequest"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhotos(req: ServiceRequest): string[] {
    return [req.photo_1, req.photo_2, req.photo_3].filter(
        (p): p is string => p !== null
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

// ─── Photo Carousel ───────────────────────────────────────────────────────────

export function PhotoCarousel({ photos }: { photos: string[] }) {
    const [current, setCurrent] = useState<number>(0);

    if (photos.length === 0) {
        return (
            <div className="w-full h-40 bg-base-200 border-b border-black flex flex-col items-center justify-center gap-2">
                <ImageOff size={22} strokeWidth={1.5} className="text-primary/20" />
                <span className="text-xs text-primary/30">No photos</span>
            </div>
        );
    }

    const prev = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setCurrent((c) => (c - 1 + photos.length) % photos.length);
    };

    const next = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setCurrent((c) => (c + 1) % photos.length);
    };

    return (
        <div className="relative w-full h-40 bg-white border-b border-black overflow-hidden group">
            <img
                src={`${import.meta.env.VITE_IMAGE_URL}/device_service/${photos[current]}`}
                alt={`device-photo-${current + 1}`}
                className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-base-100 border border-black p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={14} />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrent(i);
                                }}
                                className={`w-1.5 h-1.5 rounded-full border border-black transition-colors ${i === current ? "bg-base-content" : "bg-base-100"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            <span className="absolute top-2 right-2 badge bg-black/60 text-white border-none">
                {current + 1}/{photos.length}
            </span>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ServiceRequestCardProps {
    request: ServiceRequest;
    onCardClick: (id: string) => void;
}

function ServiceRequestCard({ request, onCardClick }: ServiceRequestCardProps) {
    const photos = getPhotos(request);
    const statusCfg = STATUS_CONFIG[request.status];

    return (
        <div
            onClick={() => onCardClick(request.id)}
            className="bg-white border border-black cursor-pointer transition-shadow duration-150 flex flex-col"
        >
            <PhotoCarousel photos={photos} />

            <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Status + date */}
                <div className="flex items-center justify-between">
                    <span
                        className={`badge badge-circle font-semibold ${statusCfg.badgeClass}`}
                    >
                        {statusCfg.label}
                    </span>
                    <span className="text-xs text-primary/50 flex items-center gap-1">
                        <Clock size={11} strokeWidth={1.5} />
                        {formatDate(request.created_at)}
                    </span>
                </div>

                {/* Device info */}
                <div className="flex items-start gap-2">
                    <Smartphone
                        size={14}
                        strokeWidth={1.5}
                        className="text-primary/40 mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-primary leading-tight truncate">
                            {request.device_brand
                                ? `${request.device_brand}${request.device_model ? ` ${request.device_model}` : ""}`
                                : request.device_type}
                        </p>
                        <p className="text-xs text-primary/50 mt-0.5">{request.device_type}</p>
                    </div>
                </div>

                {/* Problem description */}
                <p className="text-xs text-primary/70 leading-relaxed line-clamp-2 border-l-2 border-black pl-2">
                    {request.problem_description}
                </p>

                {/* Quoted price */}
                {request.quoted_price !== null && (
                    <div className="flex items-center justify-between border border-black px-3 py-1.5">
                        <span className="text-xs text-primary/50">Quoted Price</span>
                        <span className="text-sm font-bold text-primary">
                            {formatCurrency(request.quoted_price)}
                        </span>
                    </div>
                )}

                {/* ID */}
                <p className="text-[10px] text-primary/50 font-mono truncate mt-auto pt-2 border-t border-black/10">
                    {request.id}
                </p>
            </div>
        </div>
    );
}

// ─── ServiceRequestList Props ─────────────────────────────────────────────────

export interface ServiceRequestListProps {
    /** Data array dari hook masing-masing (admin/user) */
    data: ServiceRequest[];
    loading: boolean;
    /** Handler saat card diklik — parent menentukan navigasi */
    onCardClick: (id: string) => void;
}

// ─── ServiceRequestList (Reusable) ────────────────────────────────────────────

export default function ServiceRequestList({
    data,
    loading,
    onCardClick,
}: ServiceRequestListProps) {
    const [search, setSearch] = useState<string>("");
    const [activeStatus, setActiveStatus] = useState<ServiceRequestStatus | "all">("all");

    const filtered = data.filter((r) => {
        const matchStatus = activeStatus === "all" || r.status === activeStatus;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            r.device_type.toLowerCase().includes(q) ||
            (r.device_brand?.toLowerCase().includes(q) ?? false) ||
            (r.device_model?.toLowerCase().includes(q) ?? false) ||
            r.problem_description.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const counts = data.reduce<Record<string, number>>(
        (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
        {}
    );

    return (
        <div className="flex flex-col gap-5">
            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveStatus("all")}
                    className={`btn btn-xs rounded-none border border-black h-7 min-h-0 text-xs font-semibold ${activeStatus === "all"
                        ? "btn-neutral"
                        : "btn-ghost text-primary"
                        }`}
                >
                    All
                    <span className="ml-1 opacity-60">{data.length}</span>
                </button>
                {ALL_STATUSES.map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`btn btn-xs rounded-none border border-black h-7 min-h-0 text-xs font-semibold ${activeStatus === status
                            ? "btn-neutral"
                            : "btn-ghost text-primary"
                            }`}
                    >
                        {STATUS_CONFIG[status].label}
                        {counts[status] !== undefined && (
                            <span className="ml-1 opacity-60">{counts[status]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24 gap-3 text-primary/40">
                    <span className="loading loading-spinner loading-sm" />
                    <span className="text-sm">Loading requests...</span>
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary/30">
                    <Smartphone size={36} strokeWidth={1} />
                    <p className="text-sm">No service requests found.</p>
                </div>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((req) => (
                        <ServiceRequestCard
                            key={req.id}
                            request={req}
                            onCardClick={onCardClick}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}