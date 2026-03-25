import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/products/useProducts";
import HomePage from "./com/HomeComponent";
import type { CategoryProductGroup, Product } from "../../types/product";

export default function HomePages() {

    const { getHomeData } = useProducts()
    const [bestSeller, setBestSeller] = useState<Product[] | null>([])
    const [productCatGroup, setProductCatGroup] = useState<CategoryProductGroup[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const resp = await getHomeData()
            if (resp.success) {
                setBestSeller(resp.data.best_seller)
                setProductCatGroup(resp.data.product_data)
            }
        }

        fetchData()
    }, [])
    return (
        <div className="md:p-6">
            {bestSeller && productCatGroup && (<HomePage bestSellers={bestSeller} productData={productCatGroup} />)}
        </div>
    )
}