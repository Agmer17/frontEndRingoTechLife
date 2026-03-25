import axiosInstance from "../../lib/axios"
import type { CreateServiceRequestDTO } from "../../types/serviceRequest"
import { handleApiError } from "../../utils/errorUtils"

export default function useServiceRequest() {
    const getAll = async () => {
        try {
            const response = await axiosInstance.get("/device-service/get-all")
            const data = response.data.data

            return { success: true as const, message: "behasil mengambil data", data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const createNew = async (newData: CreateServiceRequestDTO) => {
        try {
            const formData = new FormData();

            // required
            formData.append("device_type", newData.device_type);
            formData.append("problem_description", newData.problem_description);

            // optional (only if exists)
            if (newData.device_brand) {
                formData.append("device_brand", newData.device_brand);
            }

            if (newData.device_model) {
                formData.append("device_model", newData.device_model);
            }

            // files (IMPORTANT)
            newData.device_image.forEach((file) => {
                formData.append("device_images", file);
            });

            const response = await axiosInstance.post(
                "/device-service/new",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = response.data.data
            return { success: true as const, message: "Berhasil mengirim data!", data }
        } catch (error) {
            return handleApiError(error);
        }
    };

    const getallMyService = async () => {
        try {
            const response = await axiosInstance.get("/device-service/get-my-service")

            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }

        } catch (error) {
            return handleApiError(error)
        }
    }

    const getById = async (id: string) => {
        try {
            const response = await axiosInstance.get("/device-service/details/" + id)

            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }

        } catch (error) {
            return handleApiError(error)
        }
    }

    const adminQuoteService = async (id: string, quoted_price: number, estimated_duration: number, admin_note?: string) => {
        try {
            const response = await axiosInstance.post("/device-service/quote-service/" + id, {
                quoted_price,
                estimated_duration,
                admin_note
            })


            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const adminReject = async (id: string, admin_note: string) => {
        try {

            const response = await axiosInstance.put("/device-service/admin-reject/" + id, {
                admin_note
            })
            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }

    }

    const userDecision = async (id: string, accept: boolean) => {
        try {

            const response = await axiosInstance.put("/device-service/status-service/" + id, {
                accept
            })
            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    return { getAll, createNew, getallMyService, getById, adminQuoteService, adminReject, userDecision }
}