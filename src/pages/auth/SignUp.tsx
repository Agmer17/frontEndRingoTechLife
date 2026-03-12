import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSignup } from "../../hooks/auth/useSignup";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";


interface SignUpData {
    full_name: string
    email: string
    phone_number: string
    password: string
}

const errorKeyMap: Record<string, string> = {
    Email: "email",
    FullName: "full_name",
    PhoneNumber: "phone_number",
    Password: "password",
}


export default function SignupPage() {

    const [data, setData] = useState<SignUpData>({
        full_name: "",
        email: "",
        phone_number: "",
        password: ""
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const { toast, shakeKey, showToast, dismissToast } = useToast();
    const { signUp } = useSignup()
    const navigate = useNavigate()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await signUp(data)

        if (result.success) {
            setFieldErrors({}) // reset error
            showToast("success", result.message || "Daftar berhasil!", {
                duration: 800,
                onSuccess: () => navigate("/auth/login"),
            })
        } else {
            if (typeof result.error === "string") {
                setFieldErrors({})
                showToast("error", result.error)
            } else if (result.error && typeof result.error === "object") {
                setFieldErrors(result.error)
                showToast("error", "Data yang kamu isi tidak lengkap!")
                const mappedErrors: Record<string, string> = {}

                Object.entries(result.error).forEach(([key, value]) => {
                    const mappedKey = errorKeyMap[key]
                    if (mappedKey) {
                        mappedErrors[mappedKey] = value
                    }
                })

                setFieldErrors(mappedErrors)
            }
        }
    }



    return (
        <div className="flex flex-col gap-4 h-full items-center justify-center bg-white p-4">

            <h1 className="text-2xl text-primary font-bold">
                Sign Up
            </h1>
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Daftar Berhasil!"
                errorTitle="Daftar Gagal"
            />

            <div className="w-full max-w-sm border border-gray-400 p-5 rounded-2xl shadow-sm">
                <form className="flex flex-col gap-4">

                    {/* Nama Lengkap */}
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Nama
                            </span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            onChange={handleFormChange}
                            className={`input input-bordered w-full rounded-2xl h-10 ${fieldErrors.full_name ? "input-error" : "border-gray-500"
                                } focus:outline-none`}
                        />

                        {fieldErrors.full_name && (
                            <div className="text-error text-sm mt-1">
                                {fieldErrors.full_name}
                            </div>
                        )}
                    </div>

                    {/* Nomor HP */}
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Nomor Hp
                            </span>
                        </label>
                        <input
                            type="text"
                            required
                            name="phone_number"
                            onChange={handleFormChange}
                            className={`input input-bordered w-full rounded-2xl ${fieldErrors.phone_number ? "input-error" : "border-gray-500"} focus:outline-none h-10`}
                        />
                        {fieldErrors.phone_number && (
                            <div className="text-error text-sm mt-1">
                                {fieldErrors.phone_number}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Email
                            </span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleFormChange}
                            className={`input input-bordered w-full rounded-2xl ${fieldErrors.email ? "input-error" : "border-gray-500"
                                } focus:outline-none h-10`}
                        />

                        {fieldErrors.email && (
                            <div className="text-error text-sm mt-1">
                                {fieldErrors.email}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-base sm:text-lg text-gray-700">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            required
                            name="password"
                            onChange={handleFormChange}
                            className={`input input-bordered w-full rounded-2xl ${fieldErrors.password ? "input-error" : "border-gray-500"
                                } focus:outline-none h-10`}
                        />
                        {fieldErrors.password && (
                            <div className="text-error text-sm mt-1">
                                {fieldErrors.password}
                            </div>
                        )}
                    </div>

                    {/* Sign Up Button */}
                    <div className="mt-3">
                        <button
                            onClick={handleSubmit}
                            className="btn bg-[#233367] hover:bg-[#1a264d] text-white border-none rounded-2xl normal-case text-base font-medium min-h-10 w-full">
                            Daftar
                        </button>
                    </div>

                </form>
            </div>

            <p className="text-xs text-primary font-bold">
                Sudah punya akun?
                <Link to={"/auth/login"}>
                    {" "}
                    <span className="underline">
                        Login
                    </span>
                </Link>
            </p>

        </div>
    );
}