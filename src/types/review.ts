export interface ReviewUser {
    user_id: string;
    user_fullname: string;
    user_profile_picture: string;
}

export interface Review {
    review_id: string;
    review_product_id: string;
    review_rating: number;
    review_comment: string;
    review_created_at: string;
    product_thumbnail: string;
    product_name: string;

    user: ReviewUser;
}

export interface ReviewResponse {
    data: Review[];
    message: string;
}

export interface CreateReviewRequest {
    product_id: string
    rating: number
    comment?: string
}

export interface UpdateReviewRequest {
    rating?: number | null
    comment?: string | null
}