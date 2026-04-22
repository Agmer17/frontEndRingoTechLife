import type { Payment } from "./payment"
import type { User } from "./user"

export type OrderStatus =
    | "pending"
    | "waiting_confirmation"
    | "confirmed"
    | "cancelled"


export interface OrderItem {
    id: string
    order_id: string
    product_id: string

    product_name: string
    product_sku?: string | null

    price_at_purchase: number
    quantity: number
    subtotal: number

    created_at: string
}


export interface Order {
    id: string
    user_id: string

    status: OrderStatus

    subtotal: number
    total_amount: number
    notes?: string | null

    created_at: string
    updated_at: string

    confirmed_at?: string | null
    cancelled_at?: string | null

    expires_at: string

    items?: OrderItem[]
    payment?: Payment | null
    user: User
}

export interface OrderResponse {
    data: Order[];
    message: string;
}


export interface CreateOrderRequest {
    product_id: string
    product_quantity: number
    order_notes?: string | null
}