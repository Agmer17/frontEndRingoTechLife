import axiosInstance from "../../lib/axios";
import type { CreateOrderRequest, Order } from "../../types/order";
import { handleApiError } from "../../utils/errorUtils";

export function useOrders() {

    const getAllOrders = async () => {
        try {
            const response = await axiosInstance.get("/orders/get-all")

            const message = response.data.message
            const data = response.data.data as Order[]

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error);

        }
    }

    const getByDetailId = async (id: string) => {
        try {
            const resp = await axiosInstance.get("/orders/id/" + id)
            const data = resp.data.data
            const message = resp.data.message


            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getMyOrder = async () => {
        try {
            const response = await axiosInstance.get("/orders/my-orders")


            const data = response.data.data
            const message = response.data.message

            return { success: true as const, message, data }
        } catch (error) {
            return handleApiError(error)
        }
    }


    const createOrder = async (order: CreateOrderRequest) => {

        try {
            const response = await axiosInstance.post("/orders/create-order", order)


            const data = response.data.data
            const message = response.data.message


            return { success: true as const, data, message }
        } catch (error) {
            return handleApiError(error)
        }
    }


    return { getAllOrders, getByDetailId, getMyOrder, createOrder }
}