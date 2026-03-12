
import { useState } from "react";
import type { ProductImage } from "./../../types/product"
import { ChevronLeft, ChevronRight } from "lucide-react";
export function ProductImageCarousel({
    images,
    productName,
    imageBaseUrl = "",
}: {
    images: ProductImage[];
    productName: string;
    imageBaseUrl?: string;
}) {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
    const primaryIndex = sorted.findIndex((img) => img.is_primary);
    const [currentIndex, setCurrentIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);

    const prev = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((i) => (i - 1 + sorted.length) % sorted.length);
    }
    const next = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((i) => (i + 1) % sorted.length);
    }

    if (sorted.length === 0) {
        return (
            <div className="w-48 h-48 shrink-0 rounded-xl flex items-center justify-center bg-base-200">
                <span className="text-xs text-base-content/50">No Image</span>
            </div>
        );
    }

    return (
        <div className="relative w-full md:w-48 h-48 shrink-0">
            <img
                src={`${imageBaseUrl}${sorted[currentIndex].image_url}`}
                alt={`${productName} - ${currentIndex + 1}`}
                className=" w-full md:w-48 h-48 object-cover rounded-xl"
            />

            {sorted.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-1 top-1/2 -translate-y-1/2 btn btn-xs btn-circle border border-black bg-base-100 hover:bg-base-200"
                    >
                        <ChevronLeft size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-xs btn-circle border border-black bg-base-100 hover:bg-base-200"
                    >
                        <ChevronRight size={12} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {sorted.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentIndex(i)}
                                className={`w-1.5 h-1.5 rounded-full border border-black transition-all ${i === currentIndex ? "bg-primary" : "bg-base-100"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}