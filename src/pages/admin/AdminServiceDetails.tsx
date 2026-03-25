import { useNavigate, useParams } from "react-router";
import useServiceRequest from "../../hooks/service_request/useServiceRequest";
import { useEffect, useState } from "react";
import type { ServiceRequest } from "../../types/serviceRequest";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import ServiceRequestDetailComponent from "../../components/shared/ServiceRequestDetailCom";

export default function AdminServiceDetails() {
    const { id } = useParams()

    const { getById, adminQuoteService, adminReject } = useServiceRequest()
    const [data, setData] = useState<ServiceRequest | null>(null)
    const { toast, dismissToast, showToast } = useToast();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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


    const handleQuote = async (payload: {
        quoted_price: number;
        estimated_duration: number;
        admin_note?: string;
    }) => {

        if (data == null) {
            return
        }
        setLoading(true)
        const res = await adminQuoteService(data?.id, payload.quoted_price, payload.estimated_duration, payload.admin_note)
        setLoading(false)

        if (res.success) {
            showToast("success", "berhasil mengirimkan penawaran ke user", {
                onSuccess: () => {
                    navigate("/admin/services")
                }
            })
        } else {
            showToast("error", res.error)
        }



    };

    const handleRejectByAdmin = async (note: string) => {
        if (data == null) {
            return
        }
        setLoading(true)
        const res = await adminReject(data.id, note)
        setLoading(false)

        if (res.success) {
            showToast("success", "berhasil mengirimkan penawaran ke user", {
                onSuccess: () => {
                    navigate("/admin/services")
                }
            })
        } else {
            showToast("error", res.error)
        }

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