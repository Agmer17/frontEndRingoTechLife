import { useState, useEffect, useCallback } from "react"

const slides = [
    {
        id: 1,
        label: "Produk Pilihan",
        title: "Teknologi\nTerbaik",
        subtitle: "Harga terjangkau, kualitas terjamin untuk kebutuhan sehari-hari",
        image: "/images/image1.jpeg",
    },
    {
        id: 2,
        label: "Penawaran Terbatas",
        title: "Promo\nSpesial",
        subtitle: "Diskon hingga 40% untuk produk pilihan minggu ini",
        image: "/images/image2.jpeg",
    },
    {
        id: 3,
        label: "Keuntungan Berbelanja",
        title: "Gratis\nOngkir",
        subtitle: "Untuk setiap pembelian di atas Rp 500.000 ke seluruh Indonesia",
        image: "/images/image1.jpeg",
    },
]
export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
    }, [])

    useEffect(() => {
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [next])

    const slide = slides[current]

    return (
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden rounded-2xl border border-base-200">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative h-full px-6 sm:px-8 py-6 flex flex-col justify-between text-white">

                {/* Label */}
                <div>
                    <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                        {slide.label}
                    </span>
                </div>

                {/* Main */}
                <div className="mt-3 max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-semibold leading-tight line-clamp-2">
                        {slide.title}
                    </h2>
                    <p className="text-sm text-white/80 mt-2 line-clamp-2">
                        {slide.subtitle}
                    </p>
                </div>

                {/* Dots */}
                <div className="flex gap-1">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1 rounded-full transition-all duration-300 ${i === current
                                    ? "bg-white w-6"
                                    : "bg-white/40 w-3"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}