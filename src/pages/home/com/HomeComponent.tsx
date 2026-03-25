import type { CategoryProductGroup, Product } from "../../../types/product";
import HeroCarousel from "./HeroCarouselCom";
import BestSellerSection from "./BestSellerSection";
import CategorySection from "./CategorySection";



interface HomePageProps {
    bestSellers: Product[];
    productData: CategoryProductGroup[];
}

export default function HomePage({ bestSellers, productData }: HomePageProps) {
    return (
        <div className="flex flex-col gap-8 pb-8">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Best Seller */}
            <BestSellerSection products={bestSellers} />

            {/* Divider */}
            {bestSellers.length > 0 && productData.length > 0 && (
                <div className="border-t border-black/10" />
            )}

            {/* Per-Category Sections */}
            {productData.map((group) => (
                <CategorySection
                    key={group.category_id}
                    category={group}
                    products={group.products}
                />
            ))}

            {/* Empty state */}
            {productData.length === 0 && bestSellers.length === 0 && (
                <div className="text-center py-24 text-base-content/40 text-sm">
                    Belum ada produk tersedia.
                </div>
            )}
        </div>
    );
}