import { Outlet, NavLink, useNavigate } from "react-router";
import Navbar from "../shared/Navbar";
import { Receipt, Star, ShoppingCart, LogOut, Wrench } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { logout } from "../../store/slieces/authslice";
import { useLogout } from "../../hooks/auth/useLogout";

export default function AccountLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { accountLogout } = useLogout()

    const handleLogout = async () => {
        dispatch(logout());
        await accountLogout()
        navigate("/", { replace: true });
    };

    const navStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all
        ${isActive ? "bg-primary text-primary-content font-medium" : "hover:bg-base-300"}`;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navbar sudah sticky dari komponennya sendiri */}
            <Navbar />

            <div className="flex flex-1 pt-10">
                {/* === Sidebar Desktop (FIXED) === */}
                <aside className="hidden md:flex md:w-64 md:fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-black p-6 flex-col bg-white z-40">
                    {/* Bagian Link Menu */}
                    <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
                        <NavLink to="/account/transactions" className={navStyle}>
                            <Receipt size={20} />
                            <span>Transactions</span>
                        </NavLink>

                        <NavLink to="/account/reviews" className={navStyle}>
                            <Star size={20} />
                            <span>Reviews</span>
                        </NavLink>

                        <NavLink to="/account/services" className={navStyle}>
                            <Wrench size={20} />
                            <span>service</span>
                        </NavLink>
                    </div>

                    {/* SIGN OUT di bagian bawah sidebar */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content w-full transition"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* === Main Content === */}
                {/* md:ml-64 penting agar konten tidak tertutup sidebar yang fixed */}
                <main className="flex-1 md:ml-64 p-4 md:p-8 mb-20 md:mb-0">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* === Bottom Navigation Mobile === */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 
            bg-white border-t border-base-300 
            shadow-[0_-2px_8px_rgba(0,0,0,0.05)]
            h-16 flex justify-around items-center">

                <NavLink
                    to="/account/transactions"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center text-xs gap-1 transition 
                    ${isActive ? "text-primary" : "text-base-content/70"}`
                    }
                >
                    <Receipt size={20} />
                    <span>Transactions</span>
                </NavLink>

                <NavLink
                    to="/account/reviews"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center text-xs gap-1 transition 
                    ${isActive ? "text-primary" : "text-base-content/70"}`
                    }
                >
                    <Star size={20} />
                    <span>Reviews</span>
                </NavLink>

                <NavLink
                    to="/account/services"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center text-xs gap-1 transition 
                    ${isActive ? "text-primary" : "text-base-content/70"}`
                    }
                >
                    <Wrench size={20} />
                    <span>service</span>
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center text-xs gap-1 text-error"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}