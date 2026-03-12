export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;

    product_name: string;
    product_sku?: string;
    price_at_purchase: number;
    quantity: number;
    subtotal: number;

    created_at: string;
}

export interface Payment {
    id: string;
    order_id: string;
    status: string;
    amount: number;

    proof_image?: string;
    admin_note?: string;
    verified_by?: string;

    created_at: string;
    updated_at: string;
    submitted_at?: string;
    verified_at?: string;
}

export interface Order {
    id: string;
    user_id: string;
    status: string;

    subtotal: number;
    total_amount: number;
    notes?: string;

    created_at: string;
    updated_at: string;
    confirmed_at?: string;
    cancelled_at?: string;

    items?: OrderItem[];
    payment?: Payment;
}

export interface OrderResponse {
    data: Order[];
    message: string;
}