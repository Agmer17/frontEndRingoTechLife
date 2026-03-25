import { useParams } from "react-router";
import useServiceRequest from "../../hooks/service_request/useServiceRequest";
import { useEffect, useState } from "react";
import type { ServiceRequest } from "../../types/serviceRequest";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import ServiceRequestDetailComponent from "../../components/shared/ServiceRequestDetail";

export default function AdminServiceDetails() {
    const { id } = useParams()

    const { getById } = useServiceRequest()
    const [data, setData] = useState<ServiceRequest | null>(null)
    const { toast, dismissToast, showToast } = useToast();
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        (async () => {
            setLoading(true)
            const res = await getById(id || "")
            setLoading(false)

            if (res.success) {
                setData(res.data)
            } else {
                showToast("error", res.error)
            }
        })()

    }, [])


    const handleQuote = (payload: {
        quoted_price: number;
        estimated_duration: number;
        admin_note?: string;
    }) => {
        console.log("QUOTE SUBMITTED:", payload);

        alert(
            `Quote:\nHarga: ${payload.quoted_price}\nDurasi: ${payload.estimated_duration} hari\nNote: ${payload.admin_note}`
        );
    };

    const handleRejectByAdmin = (note: string) => {
        console.log("ADMIN REJECT:", note);

        alert(`Rejected with note:\n${note}`);
    };
    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Operasi Berhasil!"
                errorTitle="Operasi Gagal"
            />

            {data && (
                <ServiceRequestDetailComponent
                    data={data}
                    loading={loading}
                    isAdmin={true}
                    onQuote={handleQuote}
                    onRejectByAdmin={handleRejectByAdmin}
                />
            )}
        </div>
    )
}