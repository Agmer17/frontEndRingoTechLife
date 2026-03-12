import { useNavigate, useParams } from "react-router";
import { Toast } from "../../components/shared/Toast";
import { useToast } from "../../hooks/ui/useToast";
import { useEffect, useRef, useState } from "react";
import { errorKeyMap } from "./../../types/user"
import UserForm from "../../components/shared/UserDataForm";
import { useAdminUser } from "../../hooks/admin/useAdminUser";

interface FormValues {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    profile_picture: File | null;
    role: string;
}


export default function AdminEditUserPage() {
    const { id } = useParams();
    const { getByUserId, updateUser } = useAdminUser()
    const { toast, dismissToast, showToast } = useToast();
    const [notFound, setNotFound] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formValues, setFormValues] = useState<FormValues>({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        profile_picture: null,
        role: "user",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate()

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const res = await getByUserId(id);

            if (!res.success) {
                setNotFound(true);

                if (typeof res.error === "string") {
                    showToast("error", res.error || "User tidak ditemukan");
                }

                return;
            }

            const u = res.data;

            setFormValues({
                full_name: u.full_name ?? "",
                email: u.email ?? "",
                phone_number: u.phone_number ?? "",
                password: "",
                profile_picture: null,
                role: u.role ?? "user",
            });

            if (u.profile_picture) {
                setPreviewImage(
                    `${import.meta.env.VITE_IMAGE_URL}/user/${u.profile_picture}`
                );
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))

        setFieldErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    }

    // HANDLE FILE
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormValues((prev) => ({
            ...prev,
            profile_picture: file,
        }));

        setPreviewImage(URL.createObjectURL(file));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await updateUser(id || "", formValues)

        if (result.success) {
            setFieldErrors({})
            showToast("success", result.message || "Berhasil memperbaharui data", {
                duration: 800,
            })
        } else {
            if (typeof result.error === "string") {
                setFieldErrors({})
                showToast("error", result.error)
            } else if (result.error && typeof result.error === "object") {
                const mappedErrors: Record<string, string> = {}

                Object.entries(result.error).forEach(([key, value]) => {
                    const mappedKey = errorKeyMap[key]
                    if (mappedKey) {
                        mappedErrors[mappedKey] = String(value)
                    }
                })

                setFieldErrors(mappedErrors)

                showToast("error", "Data yang kamu isi tidak valid!")
            }
        }
    }

    if (!id) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h1 className="text-error text-2xl md:text-3xl">
                    Data user tidak ditemukan!
                </h1>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center space-y-6">

                    {/* ERROR CODE */}
                    <h1 className="text-7xl font-extrabold text-error tracking-widest">
                        404
                    </h1>

                    {/* MESSAGE */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">
                            User Tidak Ditemukan
                        </h2>
                        <p className="text-base-content/60 max-w-md mx-auto">
                            Data user yang kamu cari tidak tersedia atau sudah dihapus.
                            Silakan kembali ke halaman daftar user.
                        </p>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="pt-4">
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="btn btn-primary"
                        >
                            Kembali ke Daftar User
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />

            <main className="container mx-auto py-10 px-4">
                <div className="rounded-xl border border-black overflow-hidden">
                    <div className="p-6 border-b border-black">
                        <h1 className="p-4 text-2xl font-bold text-warning-content badge badge-lg badge-warning">
                            Edit User
                        </h1>
                        <p className="text-sm opacity-60 mt-1">
                            User ID: {id}
                        </p>
                    </div>

                    <UserForm
                        formValues={formValues}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onFileChange={handleFileChange}
                        previewImage={previewImage}
                        fileInputRef={fileInputRef}
                        onImageClick={handleImageClick}
                        showRole={true}
                    />
                </div>
            </main>
        </div>
    );
}