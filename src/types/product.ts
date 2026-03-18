import type { Category } from "./Category";
import type { Review } from "./review";

// Types
export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
}

export interface Product {
    product_id: string;
    product_category_id: string;
    product_name: string;
    product_slug: string;
    product_description: string;
    product_brand: string;
    product_condition: ProductCondition;
    product_price: number;
    product_stock: number;
    product_sku: string;
    product_specification: Record<string, string>;
    product_status: ProductStatus;
    product_is_featured: boolean;
    product_weight: number | null;
    product_images: ProductImage[];
    category?: Category | null;
    product_created_at: string;
}


export interface CreateProductRequest {
    product_category_id: string
    product_name: string
    product_slug: string
    product_description?: string
    product_brand?: string
    product_condition: "new" | "used" | "refurbished"
    product_sku: string
    product_price: number
    product_initial_stock: number
    product_specification?: object
    product_status: "draft" | "active" | "inactive" | "out_of_stock"
    product_featured?: boolean
    product_weight?: number
    product_images?: File[]
}


export const ProducterrorKeyMap: Record<string, string> = {
    CategoryId: "product_category_id",
    Name: "product_name",
    Slug: "product_slug",
    Description: "product_description",
    Brand: "product_brand",
    Condition: "product_condition",
    Sku: "product_sku",
    Price: "product_price",
    Stock: "product_initial_stock",
    Specifications: "product_specification",
    Status: "product_status",
    IsFeatured: "product_featured",
    Weight: "product_weight",
    ProductImages: "product_images",
}


export interface UpdateProductRequest {
    product_category_id?: string | null;
    product_name?: string;
    product_slug?: string;
    product_description?: string;
    product_brand?: string;
    product_condition?: "new" | "used" | "refurbished";
    product_sku?: string;
    product_price?: number;
    product_initial_stock?: number;
    product_specification?: Record<string, string>;
    product_status?: "draft" | "active" | "inactive" | "out_of_stock";
    product_featured?: boolean;
    product_weight?: number;
    // Image management
    product_new_images?: File[];
    product_deleted_image?: string[];    // ProductImage.id yg dihapus
    product_updated_image_id?: string[]; // ProductImage.id yg di-replace (index-aligned)
    product_updated_image_files?: File[]; // file pengganti (index-aligned)
}


export const UpdateProductErrorKeyMap: Record<string, string> = {
    CategoryId: "product_category_id",
    Name: "product_name",
    Slug: "product_slug",
    Description: "product_description",
    Brand: "product_brand",
    Condition: "product_condition",
    Sku: "product_sku",
    Price: "product_price",
    Stock: "product_initial_stock",
    Specifications: "product_specification",
    Status: "product_status",
    IsFeatured: "product_featured",
    Weight: "product_weight",
    NewProductImages: "product_new_images",
    DeletedImage: "product_deleted_image",
    UpdatedImage: "product_updated_image_id",
};


export interface ProductDetailResponse {
    product_id: string
    product_category_id: string
    product_name: string
    product_slug: string
    product_description?: string | null
    product_brand?: string | null
    product_condition: "new" | "used" | "refurbished"
    product_price: number
    product_stock: number
    product_sku?: string | null
    product_specification: Record<string, string>
    product_status: "draft" | "active" | "inactive" | "out_of_stock"
    product_is_featured: boolean
    product_weight?: number | null
    product_images: ProductImage[]
    category?: Category | null
    product_created_at: string
    reviews: Review[]
}


export type ProductCondition = "new" | "used" | "refurbished"
export type ProductStatus = "inactive" | "active" | "out_of_stock" | "draft"