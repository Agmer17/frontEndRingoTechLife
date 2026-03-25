import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Zap, Tag, Truck } from "lucide-react"

const slides = [
    {
        id: 1,
        label: "Produk Pilihan",
        title: "Teknologi\nTerbaik",
        subtitle: "Harga terjangkau, kualitas terjamin untuk kebutuhan sehari-hari",
        cta: "Belanja Sekarang",
        Icon: Zap,
    },
    {
        id: 2,
        label: "Penawaran Terbatas",
        title: "Promo\nSpesial",
        subtitle: "Diskon hingga 40% untuk produk pilihan minggu ini",
        cta: "Lihat Promo",
        Icon: Tag,
    },
    {
        id: 3,
        label: "Keuntungan Berbelanja",
        title: "Gratis\nOngkir",
        subtitle: "Untuk setiap pembelian di atas Rp 500.000 ke seluruh Indonesia",
        cta: "Cek Syarat",
        Icon: Truck,
    },
]

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
    }, [])

    const prev = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    }

    useEffect(() => {
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [next])

    const slide = slides[current]

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-base-200 bg-base-100">
            <div className="px-7 py-8 sm:px-10 sm:py-10 min-h-[200px] sm:min-h-[220px] flex flex-col justify-between">

                {/* Top row: label + icon */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
                        {slide.label}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/40">
                        <slide.Icon size={17} />
                    </div>
                </div>

                {/* Main content */}
                <div className="mt-5">
                    <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-base-content whitespace-pre-line">
                        {slide.title}
                    </h2>
                    <p className="text-sm text-base-content/50 mt-2 max-w-xs leading-relaxed">
                        {slide.subtitle}
                    </p>
                </div>

                {/* Bottom row: cta + nav */}
                <div className="flex items-center justify-between mt-6">
                    <button className="btn btn-sm btn-neutral rounded-lg px-5">
                        {slide.cta}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            className="w-7 h-7 rounded-lg border border-base-200 bg-base-100 hover:bg-base-200 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={next}
                            className="w-7 h-7 rounded-lg border border-base-200 bg-base-100 hover:bg-base-200 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1 px-7 sm:px-10 pb-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${i === current
                                ? "bg-base-content w-6"
                                : "bg-base-content/20 w-3"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}