// =============================================================================
// ADMIN DASHBOARD — API TYPES
// Pisah per section/grafik biar gampang bikin BE-nya
// =============================================================================

// =============================================================================
// 1. SUMMARY CARDS (stat cards di bagian atas)
//    GET /api/admin/dashboard/summary
// =============================================================================
export interface DashboardSummary {
    total_transactions: number;   // total semua transaksi
    total_payments: number;       // total semua payment
    total_revenue: number;        // total pendapatan (Rupiah)
    total_products: number;       // total produk aktif
}

// =============================================================================
// 2. REVENUE OVERVIEW (Line Chart)
//    GET /api/admin/dashboard/revenue?period=monthly&year=2024
// =============================================================================
export interface RevenueDataPoint {
    name: string;       // label bulan/minggu, e.g. "Jan", "Feb"
    revenue: number;    // total revenue periode tsb (Rupiah)
}

export interface RevenueOverviewResponse {
    data: RevenueDataPoint[];
    period: "monthly" | "weekly" | "daily";
    year?: number;
}

// =============================================================================
// 3. TRANSACTIONS OVERVIEW (Bar Chart)
//    GET /api/admin/dashboard/transactions?period=monthly&year=2024
// =============================================================================
export interface TransactionDataPoint {
    name: string;           // label bulan/minggu, e.g. "Jan", "Feb"
    transactions: number;   // jumlah transaksi periode tsb
}

export interface TransactionOverviewResponse {
    data: TransactionDataPoint[];
    period: "monthly" | "weekly" | "daily";
    year?: number;
}

// =============================================================================
// 4. PERTUMBUHAN USER (Area Chart)
//    GET /api/admin/dashboard/users/growth?period=monthly&year=2024
// =============================================================================
export interface UserGrowthDataPoint {
    name: string;   // label bulan/minggu, e.g. "Jan", "Feb"
    users: number;  // jumlah user baru periode tsb
}

export interface UserGrowthResponse {
    data: UserGrowthDataPoint[];
    period: "monthly" | "weekly" | "daily";
    year?: number;
}

// =============================================================================
// 5. PRODUK PER KATEGORI (Horizontal Bar Chart)
//    GET /api/admin/dashboard/products/by-category
// =============================================================================
export interface ProductByCategoryDataPoint {
    name: string;   // nama kategori, e.g. "Elektronik"
    value: number;  // jumlah produk di kategori tsb
}

export type ProductByCategoryResponse = ProductByCategoryDataPoint[];

// =============================================================================
// 6. PERFORMA KATEGORI (Radar Chart)
//    GET /api/admin/dashboard/categories/performance
// =============================================================================
export interface CategoryPerformanceDataPoint {
    category: string;   // nama kategori
    sales: number;      // jumlah item terjual
    revenue: number;    // total revenue kategori (Rupiah)
    reviews: number;    // jumlah review di kategori tsb
}

export type CategoryPerformanceResponse = CategoryPerformanceDataPoint[];

// =============================================================================
// 7. STATUS ORDER (Pie Chart)
//    GET /api/admin/dashboard/orders/by-status
// =============================================================================
export type OrderStatus =
    | "pending"
    | "waiting_confirmation"
    | "confirmed"
    | "cancelled";

export interface OrderStatusDataPoint {
    key: OrderStatus;   // key status asli dari BE
    name: string;       // label human-readable, e.g. "Menunggu Konfirmasi"
    value: number;      // jumlah order dengan status tsb
}

export type OrderStatusResponse = OrderStatusDataPoint[];

// =============================================================================
// 8. STATUS PAYMENT (Donut Chart)
//    GET /api/admin/dashboard/payments/by-status
// =============================================================================
export type PaymentStatus =
    | "unpaid"
    | "submitted"
    | "approved"
    | "rejected";

export interface PaymentStatusDataPoint {
    key: PaymentStatus; // key status asli dari BE
    name: string;       // label human-readable, e.g. "Menunggu Verifikasi"
    value: number;      // jumlah payment dengan status tsb
}

export type PaymentStatusResponse = PaymentStatusDataPoint[];

// =============================================================================
// 9. DISTRIBUSI RATING REVIEW (Pie Chart)
//    GET /api/admin/dashboard/reviews/by-rating
// =============================================================================
export interface ReviewRatingDataPoint {
    name: string;   // e.g. "1 Bintang", "2 Bintang", ..., "5 Bintang"
    value: number;  // jumlah review dengan rating tsb
}

export type ReviewRatingResponse = ReviewRatingDataPoint[];

// =============================================================================
// AGGREGATE — semua dashboard dalam 1 call (opsional, kalau mau efisien)
//    GET /api/admin/dashboard/all
// =============================================================================
export interface AdminDashboardAll {
    summary: DashboardSummary;
    revenue: RevenueOverviewResponse;
    transactions: TransactionOverviewResponse;
    user_growth: UserGrowthResponse;
    products_by_category: ProductByCategoryResponse;
    category_performance: CategoryPerformanceResponse;
    orders_by_status: OrderStatusResponse;
    payments_by_status: PaymentStatusResponse;
    reviews_by_rating: ReviewRatingResponse;
}