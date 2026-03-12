import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshSession } from "./store/authThunk";
import type { AppDispatch } from "./store/store";

export default function AppInitializer() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        console.log("AppInitializer mounted");
        dispatch(refreshSession());
    }, []);

    return null;
}