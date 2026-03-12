import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    AreaChart,
    Area,
} from "recharts";
import { useProfiles } from "../../hooks/profile/useProfile";
import { useEffect } from "react";

// ── Status helpers ──────────────────────────────────────────────────────────
const getStatusBadge = (status: string) => {
    switch (status) {
        case "pending":
            return { className: "badge-info", label: "Pending" };
        case "waiting_confirmation":
            return { className: "badge-warning", label: "Menunggu Konfirmasi" };
        case "confirmed":
            return { className: "badge-success", label: "Terkonfirmasi" };
        case "cancelled":
            return { className: "badge-error", label: "Dibatalkan" };
        default:
            return { className: "badge-neutral", label: status };
    }
};



const getPaymentBadge = (status: string) => {
    switch (status) {
        case "unpaid":
            return { className: "badge-neutral", label: "Belum Bayar" };
        case "submitted":
            return { className: "badge-warning", label: "Menunggu Verifikasi" };
        case "approved":
            return { className: "badge-success", label: "Disetujui" };
        case "rejected":
            return { className: "badge-error", label: "Ditolak" };
        default:
            return { className: "badge-outline", label: status };
    }
};

// ── Color maps — selaras dengan badge colors ────────────────────────────────
const ORDER_STATUSES = ["pending", "waiting_confirmation", "confirmed", "cancelled"];
const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: "#38bdf8",
    waiting_confirmation: "#fbbf24",
    confirmed: "#10b981",
    cancelled: "#ef4444",
};

const PAYMENT_STATUSES = ["unpaid", "submitted", "approved", "rejected"];
const PAYMENT_STATUS_COLORS: Record<string, string> = {
    unpaid: "#6b7280",
    submitted: "#fbbf24",
    approved: "#10b981",
    rejected: "#ef4444",
};

const CATEGORY_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444"];



// ── Custom legend untuk Pie charts ─────────────────────────────────────────
const PieLegend = ({
    keys,
    colorMap,
    labelFn,
}: {
    keys: string[];
    colorMap: Record<string, string>;
    labelFn: (s: string) => { label: string };
}) => (
    <div className="flex flex-wrap gap-3 justify-center mt-3">
        {keys.map((key) => (
            <div key={key} className="flex items-center gap-1.5 text-sm">
                <span
                    className="inline-block w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: colorMap[key] }}
                />
                <span>{labelFn(key).label}</span>
            </div>
        ))}
    </div>
);

// ───────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user, loading, getCurrentUser } = useProfiles();

    useEffect(() => {
        const fetchCurrent = async () => {
            await getCurrentUser()
        }

        fetchCurrent()
    }, [])


    // Revenue & Transactions
    const revenueData = [
        { name: "Jan", revenue: 0, transactions: 0 },
        { name: "Feb", revenue: 0, transactions: 0 },
        { name: "Mar", revenue: 0, transactions: 0 },
        { name: "Apr", revenue: 0, transactions: 0 },
    ];

    // Kelola User — total user saja, tanpa breakdown role
    const userGrowthData = [
        { name: "Jan", users: 0 },
        { name: "Feb", users: 0 },
        { name: "Mar", users: 0 },
        { name: "Apr", users: 0 },
    ];

    // Kelola Produk — per kategori
    const productByCategoryData = [
        { name: "Elektronik", value: 0 },
        { name: "Fashion", value: 0 },
        { name: "Makanan", value: 0 },
        { name: "Rumah Tangga", value: 0 },
        { name: "Lainnya", value: 0 },
    ];

    // Kelola Kategori — radar
    const categoryPerformanceData = [
        { category: "Elektronik", sales: 0, revenue: 0, reviews: 0 },
        { category: "Fashion", sales: 0, revenue: 0, reviews: 0 },
        { category: "Makanan", sales: 0, revenue: 0, reviews: 0 },
        { category: "Rumah Tangga", sales: 0, revenue: 0, reviews: 0 },
        { category: "Lainnya", sales: 0, revenue: 0, reviews: 0 },
    ];

    // Kelola Order — sesuai getStatusBadge keys
    const orderStatusData = ORDER_STATUSES.map((key) => ({
        key,
        name: getStatusBadge(key).label,
        value: 0,
    }));

    // Kelola Payment — sesuai getPaymentBadge keys
    const paymentStatusData = PAYMENT_STATUSES.map((key) => ({
        key,
        name: getPaymentBadge(key).label,
        value: 0,
    }));

    // Kelola Review — rating 1–5
    const reviewRatingData = [
        { name: "1 Bintang", value: 0 },
        { name: "2 Bintang", value: 0 },
        { name: "3 Bintang", value: 0 },
        { name: "4 Bintang", value: 0 },
        { name: "5 Bintang", value: 0 },
    ];

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="rounded-xl border border-black p-6">
                {loading ? (
                    <p className="text-neutral">Loading...</p>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-neutral">
                            Welcome back, {user?.full_name || "Admin"} 👋
                        </h1>
                        <p className="text-neutral opacity-70">
                            Berikut adalah ringkasan performa marketplace kamu.
                        </p>
                    </>
                )}
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-sm opacity-70">Total Transaksi</h2>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-sm opacity-70">Total Payment</h2>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-sm opacity-70">Total Pendapatan</h2>
                    <p className="text-2xl font-bold mt-2">Rp 0</p>
                </div>
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-sm opacity-70">Total Produk</h2>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="rounded-xl border border-black p-6">
                <h2 className="text-lg font-bold mb-6">Revenue Overview</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions Chart */}
            <div className="rounded-xl border border-black p-6">
                <h2 className="text-lg font-bold mb-6">Transactions Overview</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="transactions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── KELOLA USER ──────────────────────────────────────────── */}
            <div className="rounded-xl border border-black p-6">
                <h2 className="text-lg font-bold mb-1">Pertumbuhan User</h2>
                <p className="text-sm opacity-60 mb-6">Total user baru per bulan</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                fill="url(#userGrad)"
                                name="User Baru"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── KELOLA PRODUK & KATEGORI ──────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Produk per Kategori */}
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-lg font-bold mb-1">Produk per Kategori</h2>
                    <p className="text-sm opacity-60 mb-6">Jumlah produk tiap kategori</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productByCategoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={110} />
                                <Tooltip />
                                <Bar dataKey="value" name="Jumlah Produk" radius={[0, 4, 4, 0]}>
                                    {productByCategoryData.map((_, i) => (
                                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performa Kategori — Radar */}
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-lg font-bold mb-1">Performa Kategori</h2>
                    <p className="text-sm opacity-60 mb-6">Sales, Revenue & Review per kategori</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                data={categoryPerformanceData}
                            >
                                <PolarGrid />
                                <PolarAngleAxis dataKey="category" />
                                <PolarRadiusAxis />
                                <Radar name="Sales" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name="Revenue" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                <Radar name="Reviews" dataKey="reviews" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── KELOLA ORDER & PAYMENT ────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Order */}
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-lg font-bold mb-1">Status Order</h2>
                    <p className="text-sm opacity-60 mb-4">Distribusi status semua order</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {orderStatusData.map((entry, i) => (
                                        <Cell key={i} fill={ORDER_STATUS_COLORS[entry.key] ?? "#94a3b8"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <PieLegend
                        keys={ORDER_STATUSES}
                        colorMap={ORDER_STATUS_COLORS}
                        labelFn={getStatusBadge}
                    />
                </div>

                {/* Status Payment */}
                <div className="rounded-xl border border-black p-6">
                    <h2 className="text-lg font-bold mb-1">Status Payment</h2>
                    <p className="text-sm opacity-60 mb-4">Distribusi status semua payment</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {paymentStatusData.map((entry, i) => (
                                        <Cell key={i} fill={PAYMENT_STATUS_COLORS[entry.key] ?? "#94a3b8"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <PieLegend
                        keys={PAYMENT_STATUSES}
                        colorMap={PAYMENT_STATUS_COLORS}
                        labelFn={getPaymentBadge}
                    />
                </div>
            </div>

            {/* ── KELOLA REVIEW ─────────────────────────────────────── */}
            <div className="rounded-xl border border-black p-6">
                <h2 className="text-lg font-bold mb-1">Distribusi Rating Review</h2>
                <p className="text-sm opacity-60 mb-6">Jumlah review berdasarkan bintang</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={reviewRatingData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {reviewRatingData.map((_, i) => (
                                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}