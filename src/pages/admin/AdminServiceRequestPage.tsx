import { useState, useEffect } from "react";
import ServiceRequestList from "../../components/shared/ServiceRequestCardList";
import { type ServiceRequest } from "../../types/serviceRequest";
import useServiceRequest from "../../hooks/service_request/useServiceRequest";
import { useNavigate } from "react-router";

export default function AdminServiceRequestPage() {
    const { getAll } = useServiceRequest()

    const [data, setData] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {

            setLoading(true);
            const res = await getAll();
            setLoading(false);
            if (res.success) {
                setData(res.data)
            }

        })();
    }, []);

    const handleCardClick = (id: string): void => {
        navigate("/admin/services/details/" + id)
    };

    return (
        <div className="min-h-screen bg-white md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <p className="text-xs tracking-widest uppercase text-primary/40 mb-1">
                        Admin Panel
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Service Requests
                    </h1>
                    <p className="text-sm text-primary/50 mt-1">
                        Manage and review all incoming device service requests.
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