
import { Outlet } from "react-router";
import ringoLogo from "./../../assets/ringo-logo.png"

export default function AuthLayout() {
    return (
        <div className="w-screen h-screen flex flex-col md:gap-4 gap-2 font-sans overflow-x-hidden">

            {/* --- Bagian Header --- */}
            <div className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-center bg-linear-to-r from-primary from-55% to-white">

                {/* 1. Bagian Logo: Posisi tengah saat di HP, posisi kiri saat di Desktop */}
                <div className="flex justify-center md:justify-start">
                    <img src={ringoLogo} className="w-20 md:w-24 rounded-full" alt="Ringo Logo" />
                </div>

                {/* 2. Bagian Teks: Tepat di tengah. Ukuran font dibuat responsif */}
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl md:text-3xl text-primary-content font-bold"> Ringo Group </h1>
                    <h1 className="text-base md:text-xl text-primary-content"> One group many solutions </h1>
                </div>

                {/* 3. Bagian Spacer: Dihilangkan saat di HP, dimunculkan saat di Desktop sebagai penyeimbang layout */}
                <div className="hidden md:block"></div>

            </div>
            {/* --- Akhir Bagian Header --- */}

            <Outlet />

        </div>
    )
} 