import { useState, useEffect } from "react";
import ServiceRequestList from "../../components/shared/ServiceRequestCardList";
import { type ServiceRequest } from "../../types/serviceRequest";
import useServiceRequest from "../../hooks/service_request/useServiceRequest";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import { useNavigate } from "react-router";



export default function UserServiceRequestPage() {
    const { getallMyService } = useServiceRequest();

    const [data, setData] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast, dismissToast, showToast } = useToast();
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {

            setLoading(true);
            const res = await getallMyService();

            if (res.success) {
                setLoading(false)
                setData(res.data);
            } else {
                setLoading(false)
                showToast("error", "gagal mengambil data")
            }

        })();
    }, []);

    const handleCardClick = (id: string): void => {
        navigate("/account/services/detail/" + id)
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <p className="text-xs tracking-widest uppercase text-primary/40 mb-1">
                        Histori Service
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Daftar service
                    </h1>
                    <p className="text-sm text-primary/50 mt-1">
                        Lacak status perangkatmu disini
                    </p>
                </div>

                <ServiceRequestList
                    data={data}
                    loading={loading}
                    onCardClick={handleCardClick}
                />

            </div>
        </div>
    );
}