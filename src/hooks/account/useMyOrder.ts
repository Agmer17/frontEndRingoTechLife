// src/hooks/orders/useMyOrders.ts

import { useEffect, useState } from "react";
import { type Order } from "../../types/order";
import { useOrders } from "../orders/useOrders";

export default function useMyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const { getMyOrder } = useOrders()

    const fetchOrders = async () => {

        setLoading(true)
        const resp = await getMyOrder()
        setLoading(false)

        if (resp.success) {
            setOrders(resp.data)
        } else {
            setOrders([])
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        refetch: fetchOrders,
    };
}