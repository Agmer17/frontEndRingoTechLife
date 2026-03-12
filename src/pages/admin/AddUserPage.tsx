import { useState } from "react";
import { useAdminUser } from "../../hooks/admin/useAdminUser";
import { Toast } from "../../components/shared/Toast";
import { useToast } from "../../hooks/ui/useToast";
import { errorKeyMap } from "../../types/user";
import { useNavigate } from "react-router";

interface FormValues {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
}

export default function AddUserPage() {
    const [formValues, setFormValues] = useState<FormValues>({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { create } = useAdminUser()
    const { showToast, dismissToast, toast } = useToast();
    const navigate = useNavigate()


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))

        setFieldErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await create(formValues)

        if (res.success) {
            showToast("success", res.message)
            setTimeout(() => {
                navigate("/admin/users/")
            }, 1000)
        } else {
            if (typeof res.error == "string") {
                showToast("error", res.error)
            } else if (typeof res.error == "object") {
                const mappedErrors: Record<string, string> = {}
                Object.entries(res.error).forEach(([key, value]) => {
                    const mappedKey = errorKeyMap[key]
                    if (mappedKey) {
                        mappedErrors[mappedKey] = String(value)
                    }
                })

                setFieldErrors(mappedErrors)

                showToast("error", "Data yang kamu isi tidak valid!")
            }
        }


    };

    return (
        <div className="p-2">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            <div className="card bg-base-100 text-primary">
                <div className="card-body p-8">
                    <h2 className="text-2xl font-bold mb-6">Tambah pengguna</h2>
                    <div className="w-full flex justify-center">
                        <form
                            onSubmit={handleSubmit}
                            className="w-[70%] p-4 md:p-6 border border-black rounded-2xl"
                        >
                            <div className="space-y-6 max-w-xl">

                                {/* FULL NAME */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-lg">Full Name</span>
                                    </label>
                                    <input
                                        name="full_name"
                                        type="text"
                                        value={formValues.full_name}
                                        onChange={handleChange}
                                        className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.full_name ? "input-error" : ""}`}
                                    />
                                    {fieldErrors.full_name && (
                                        <div className="text-error text-sm mt-1">
                                            {fieldErrors.full_name}
                                        </div>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-lg">Email</span>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.email ? "input-error" : ""}`}
                                    />
                                    {fieldErrors.email && (
                                        <div className="text-error text-sm mt-1">
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>

                                {/* PHONE NUMBER */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-lg">Phone Number</span>
                                    </label>
                                    <input
                                        name="phone_number"
                                        type="text"
                                        value={formValues.phone_number}
                                        onChange={handleChange}
                                        className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.phone_number ? "input-error" : ""}`}
                                    />
                                    {fieldErrors.phone_number && (
                                        <div className="text-error text-sm mt-1">
                                            {fieldErrors.phone_number}
                                        </div>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-lg">Password</span>
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.password ? "input-error" : ""}`}
                                    />
                                    {fieldErrors.password && (
                                        <div className="text-error text-sm mt-1">
                                            {fieldErrors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <button
                                        type="submit"
                                        className="btn btn-success px-12 text-lg"
                                    >
                                        Simpan
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}