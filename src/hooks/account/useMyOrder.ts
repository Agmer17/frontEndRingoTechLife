// src/hooks/orders/useMyOrders.ts

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { type Order, type OrderResponse } from "../../types/order";

export default function useMyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axiosInstance.get<OrderResponse>(
                "/orders/my-orders"
            );

            setOrders(res.data.data);
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        error,
        refetch: fetchOrders,
    };
}