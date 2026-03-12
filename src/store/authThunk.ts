import { createAsyncThunk } from "@reduxjs/toolkit";

interface AuthData {
    accessToken: string;
    id: string;
    role: string;
}

export const refreshSession = createAsyncThunk<
    AuthData,
    void,
    { rejectValue: string }
>("auth/refreshSession", async (_, { rejectWithValue }) => {
    try {
        console.log("refreshSession thunk running");
        const stored = localStorage.getItem("auth");
        console.log("data stored : " + stored)
        if (stored) {
            const parsed = JSON.parse(stored);

            return {
                accessToken: parsed.access_token,
                id: parsed.id,
                role: parsed.role,
            };
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-session`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("refresh failed");
        }

        const authData = await res.json()
        console.log(authData)
        const data = authData.data;

        // simpan ke localStorage
        localStorage.setItem(
            "auth",
            JSON.stringify({
                accessToken: data.accessToken,
                id: data.id,
                role: data.role,
            })
        );

        return data;
    } catch (err) {
        return rejectWithValue("failed refresh session");
    }
});