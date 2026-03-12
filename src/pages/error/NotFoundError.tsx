import { Link } from "react-router";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="h-full w-full">
            <main className="container mx-auto py-10 px-4">
                <div className="rounded-xl border border-black overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-black">
                        <h1 className="text-2xl font-bold text-neutral">
                            Page Not Found
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">

                        <div className="w-24 h-24 rounded-full border border-black flex items-center justify-center">
                            <SearchX size={48} className="text-neutral" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-neutral">404</h2>
                            <p className="text-neutral opacity-70 max-w-md">
                                Halaman tidak ditemukan
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="btn btn-primary px-12 rounded-full text-lg"
                        >
                            Kembali ke Beranda
                        </Link>

                    </div>
                </div>
            </main>
        </div>
    );
}