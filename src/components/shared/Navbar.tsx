import { Home, Search, Wrench, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';


import { useSelector } from "react-redux";
import type { RootState } from '../../store/store';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const role = useSelector((state: RootState) => state.auth.role);

    return (
        <div className="navbar px-4 border-b border-black sticky top-0 z-50 bg-white">
            {/* Logo */}
            <div className="navbar-start">
                <span className="text-xl font-bold text-primary tracking-tight">
                    Ringo <span className="text-base-content font-normal">Techlife</span>
                </span>
            </div>

            {/* Nav Links — Desktop */}
            <div className="navbar-center hidden md:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    <li>
                        <Link to={"/"} className="flex items-center gap-2">
                            <Home size={16} />
                            Home
                        </Link>
                    </li>

                    <li>
                        <a className="flex items-center gap-2">
                            <Search size={16} />
                            Belanja
                        </a>
                    </li>

                    <li>
                        <a className="flex items-center gap-2">
                            <Wrench size={16} />
                            Repair Device
                        </a>
                    </li>

                    {/* ✅ ADMIN MENU */}
                    {role === "ADMIN" && (
                        <li>
                            <Link to="/admin/" className="flex items-center gap-2">
                                <Shield size={16} />
                                Admin Panel
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            {/* Right Side */}
            <div className="navbar-end gap-2">
                {/* Profile — Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <Link to={"/account/profile"}>
                        <div className="hidden md:flex items-center gap-2 bg-primary p-2 text-neutral-content rounded-[50%] hover:cursor-pointer hover:text-primary hover:bg-white">
                            <User className="w-6 h-6" />
                        </div>
                    </Link>
                </div>

                {/* Hamburger — Mobile */}
                <div className="flex md:hidden">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 left-0 right-0 z-50 bg-base-100 shadow-md md:hidden">
                    <ul className="menu menu-vertical p-4 gap-1">

                        <li>
                            <Link
                                to={"/"}
                                className="flex items-center gap-3 min-h-10 leading-none"
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </li>

                        <li>
                            <a className="flex items-center gap-3 min-h-10 leading-none">
                                <Search className="h-4 w-4" />
                                <span>Cari Barang</span>
                            </a>
                        </li>

                        <li>
                            <a className="flex items-center gap-3 min-h-10 leading-none">
                                <Wrench className="h-4 w-4" />
                                <span>Service</span>
                            </a>
                        </li>

                        <li className="border-t border-base-200">
                            <Link
                                to={"/account/profile"}
                                className="flex items-center gap-3 min-h-10 leading-none"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span>Profile</span>
                            </Link>
                        </li>

                        {role === "ADMIN" && (
                            <li>
                                <Link
                                    to="/admin/"
                                    className="flex items-center gap-3 min-h-10 leading-none"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span>Admin Panel</span>
                                </Link>
                            </li>
                        )}

                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;