import type { User } from "./user";

export interface CreateServiceRequestDTO {
    device_type: string;          // required, max 100
    device_brand?: string;        // optional, max 100
    device_model?: string;        // optional, max 150
    problem_description: string;  // required
    device_image: File[];         // maps to ProductPictures []*multipart.FileHeader
}


// ─── Status ───────────────────────────────────────────────────────────────────

export type ServiceRequestStatus =
    | "pending_review"
    | "quoted"
    | "accepted"
    | "rejected_by_user"
    | "rejected_by_admin"
    | "cancelled";

// ─── Model (mirrors Go struct) ────────────────────────────────────────────────

export interface ServiceRequest {
    id: string;
    user_id: string;
    device_type: string;
    device_brand: string | null;
    device_model: string | null;
    problem_description: string;
    photo_1: string | null;
    photo_2: string | null;
    photo_3: string | null;
    status: ServiceRequestStatus;
    quoted_price: number | null;
    estimated_duration: number | null;
    admin_note: string | null;
    quoted_by: string | null;
    order_id: string | null;
    created_at: string;
    updated_at: string;
    quoted_at: string | null;
    decided_at: string | null;
    user: User
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ServiceRequestListResponse {
    data: ServiceRequest[];
    message: string;
}

// ─── Status display config ────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
    ServiceRequestStatus,
    { label: string; badgeClass: string }
> = {
    pending_review: { label: "Pending Review", badgeClass: "badge-warning text-warning-content" },
    quoted: { label: "Quoted", badgeClass: "badge-info text-info-content" },
    accepted: { label: "Accepted", badgeClass: "badge-success text-success-content" },
    rejected_by_user: { label: "Rejected by User", badgeClass: "badge-error text-error-content" },
    rejected_by_admin: { label: "Rejected by Admin", badgeClass: "badge-error text-error-content" },
    cancelled: { label: "Cancelled", badgeClass: "badge-neutral text-neutral-content" },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as ServiceRequestStatus[];