import { Outlet, NavLink, useNavigate } from "react-router";
import Navbar from "../shared/Navbar";
import {
    LayoutDashboard,
    Users,
    Package,
    Layers,
    CreditCard,
    LogOut,
    ShoppingBag,
    MessageSquare,
    ClipboardList,
    Menu,
    ArrowLeft
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { logout } from "../../store/slieces/authslice";
import { useState } from "react";
import { useLogout } from "../../hooks/auth/useLogout";

export default function AdminLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { accountLogout } = useLogout();

    const handleBack = () => {
        navigate(-1);
    };

    const handleLogout = async () => {
        dispatch(logout());
        await accountLogout();
        navigate("/", { replace: true });
    };

    // 🔥 Satu sumber menu
    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} />, end: true },
        { name: "Kelola User", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Kelola Produk", path: "/admin/products", icon: <Package size={20} /> },
        { name: "Kelola Kategori", path: "/admin/categories", icon: <Layers size={20} /> },
        { name: "Kelola Order", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
        { name: "Kelola Review", path: "/admin/reviews", icon: <MessageSquare size={20} /> },
        { name: "Kelola Payment", path: "/admin/payments", icon: <ClipboardList size={20} /> },
    ];

    const navStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all
        ${isActive ? "bg-primary text-primary-content font-medium" : "hover:bg-base-300"}`;

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden pt-16">
            <Navbar />

            <div className="flex flex-1">
                <aside className="hidden md:flex md:w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-black p-6 flex-col bg-base-100 z-40">
                    {/* MENU AREA (SCROLLABLE) */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                className={navStyle}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* SIGN OUT AREA */}
                    <div className="pt-6 border-t border-base-300">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content w-full transition"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>

                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 flex-col gap-4 md:ml-64 mb-16 md:mb-10">
                    <div className="w-full mt-4 ml-4">
                        <button onClick={handleBack} className="btn btn-circle btn-md bg-white border-none text-primary hover:bg-primary hover:text-white">
                            <ArrowLeft className="w-8 h-8" />
                        </button>
                    </div>
                    <div className="p-4">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 
                bg-base-100 border-t border-base-300
                shadow-[0_-2px_8px_rgba(0,0,0,0.05)]
                h-16 flex justify-around items-center">

                {/* Dashboard */}
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center text-xs gap-1 
                        ${isActive ? "text-primary" : "text-base-content/70"}`
                    }
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {/* Menu Button */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex flex-col items-center text-xs gap-1 text-base-content/70"
                >
                    <Menu size={20} />
                    <span>Menu</span>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center text-xs text-error gap-1"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* MOBILE DRAWER */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex">
                    <div className="bg-base-100 w-72 h-full p-6 border-r border-black space-y-4">
                        <h2 className="text-lg font-bold mb-4">Admin Menu</h2>

                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all
                                    ${isActive ? "bg-primary text-primary-content font-medium" : "hover:bg-base-300"}`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content w-full"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>

                    <div className="flex-1" onClick={() => setMobileOpen(false)} />
                </div>
            )}
        </div>
    );
}