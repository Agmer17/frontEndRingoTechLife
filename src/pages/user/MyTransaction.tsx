import useMyOrders from "./../../hooks/account/useMyOrder"
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import { OrdersTables } from "../../components/shared/OrdersTable";

export default function MyTransactions() {
    const { orders, loading } = useMyOrders();
    const { toast, showToast, dismissToast } = useToast();

    if (loading) return <p className="p-6">Loading orders...</p>;

    if (!orders || orders.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <div className="text-center flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold">
                        Belum ada transaksi
                    </p>
                    <p className="text-sm text-base-content/60">
                        Kamu belum membeli apapun!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-semibold">
                Histori Transaksi
            </h1>

            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Berhasil!"
                errorTitle="Terjadi Kesalahan"
            />

            <OrdersTables orders={orders} />
        </div>
    );
}