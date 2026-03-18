export type PaymentStatus =
    | "unpaid"
    | "submitted"
    | "approved"
    | "rejected"


export interface Payment {
    id: string
    order_id: string

    status: PaymentStatus
    amount: number

    proof_image?: string | null
    admin_note?: string | null
    verified_by?: string | null

    created_at: string
    updated_at: string
    submitted_at?: string | null
    verified_at?: string | null
}