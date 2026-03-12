import { redirect } from "react-router";
import { store } from "../../store/store";
import { setCredentials } from "../../store/slieces/authslice";
import axiosInstance from "../../lib/axios";

export const adminLoader = async () => {
    const state = store.getState();

    let role = state.auth.role;
    let accessToken = state.auth.accessToken;

    // Kalau belum ada token → coba refresh
    if (!accessToken) {
        try {
            const res = await axiosInstance.get("/auth/refresh-session");

            const { id, role: newRole, access_token } = res.data.data;

            store.dispatch(
                setCredentials({
                    accessToken: access_token,
                    id,
                    role: newRole,
                })
            );

            role = newRole;
        } catch (err) {
            throw redirect("/auth/login");
        }
    }

    // Cek role
    if (role !== "ADMIN") {
        return redirect("/404");
    }

    return null;
};