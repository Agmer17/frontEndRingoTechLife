import { Link, useNavigate } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";
import { useState } from "react";
import { motion } from "framer-motion";
import { Toast } from "../../components/shared/Toast";
import { useToast } from "../../hooks/ui/useToast";

export default function LoginPage() {
    const { login } = useLogin();
    const navigate = useNavigate();

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { toast, shakeKey, showToast, dismissToast } = useToast();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(emailOrPhone, password);
        setIsLoading(false);

        if (result.success) {
            showToast("success", result.message || "Login berhasil! Selamat datang kembali.", {
                duration: 800,
                onSuccess: () => navigate("/"),
            });
        } else {
            showToast("error", result.error || "Terjadi kesalahan. Silakan coba lagi.");
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full items-center justify-center bg-white p-4">
            <h1 className="text-2xl text-primary font-bold">Login</h1>

            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Berhasil!"
                errorTitle="Login Gagal"
            />

            {/* Form Card — shakes on error */}
            <motion.div
                key={shakeKey}
                animate={toast?.type === "error" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full max-w-sm border border-gray-400 p-5 rounded-2xl shadow-sm"
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Phone Number or Email
                            </span>
                        </label>
                        <input
                            type="text"
                            required
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            className="input input-bordered w-full rounded-2xl border-gray-500 focus:border-[#233367] focus:outline-none h-10"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full rounded-2xl border-gray-500 focus:border-[#233367] focus:outline-none h-10"
                        />
                    </div>

                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn bg-[#233367] hover:bg-[#1a264d] text-white border-none rounded-2xl normal-case text-base font-medium min-h-10 w-full disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="loading loading-spinner loading-sm" />
                                    Masuk...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </div>
                </form>
            </motion.div>

            <p className="text-xs text-primary font-bold">
                Belum punya akun?{" "}
                <Link to="/auth/sign-up">
                    <span className="underline">Daftar</span>
                </Link>
            </p>
        </div>
    );
}