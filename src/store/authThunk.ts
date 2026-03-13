import { createAsyncThunk } from "@reduxjs/toolkit";

interface AuthData {
    accessToken: string;
    id: string;
    role: string;
}

export const refreshSession = createAsyncThunk<AuthData, void, { rejectValue: string }>(
    "auth/refreshSession", async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-session`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("refresh failed");

            const authData = await res.json();
            const data = authData.data;

            return {
                accessToken: data.access_token,
                id: data.id,
                role: data.role,
            };
        } catch (err) {
            return rejectWithValue("failed refresh session");
        }
    }
);