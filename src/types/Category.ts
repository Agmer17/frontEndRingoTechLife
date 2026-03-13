export interface Category {
    category_id: string;
    category_name: string;
    category_slug: string;
    category_description: string;
    total_product?: number
    category_created_at: string;
}


export interface createCategory {
    category_name: string
    category_slug: string
    category_description?: string | null
}



export interface UpdateCategoryRequest {
    category_name?: string
    category_slug?: string
    category_description?: string
}