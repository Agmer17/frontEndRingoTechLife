import { useEffect, useState } from "react"
import useServiceRequest from "../../hooks/service_request/useServiceRequest"
import type { ServiceRequest } from "../../types/serviceRequest"
import { useParams } from "react-router"
import { useToast } from "../../hooks/ui/useToast"
import { Toast } from "../../components/shared/Toast"
import ServiceRequestDetailComponent from "../../components/shared/ServiceRequestDetail"

export default function UserServiceDetails() {
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


    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Operasi Berhasil!"
                errorTitle="Operasi Gagal"
            />

            {data && <ServiceRequestDetailComponent data={data} loading={loading} />}
        </div>
    )
}