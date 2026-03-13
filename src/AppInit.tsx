import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { refreshSession } from "./store/authThunk";
import type { AppDispatch } from "./store/store";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        dispatch(refreshSession()).finally(() => setReady(true));
    }, []);

    if (!ready) return null; // atau loading spinner

    return <>{children}</>;
}