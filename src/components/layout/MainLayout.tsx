import Navbar from "../shared/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {

    return (
        <div className="w-screen min-h-screen pt-16 flex flex-col gap-4">
            <Navbar></Navbar>
            <Outlet />
        </div>
    )
}