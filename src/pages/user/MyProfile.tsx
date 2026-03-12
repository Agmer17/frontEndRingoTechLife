import { useState, useRef, useEffect } from "react";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import { errorKeyMap } from "./../../types/user"
import UserForm from "../../components/shared/UserDataForm";
import { useProfiles } from "../../hooks/profile/useProfile";


export default function ProfilePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast, showToast, dismissToast } = useToast();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { user, getCurrentUser, updateCurrent, loading } = useProfiles()

    const [formValues, setFormValues] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        profile_picture: null as File | null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            await getCurrentUser()
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (user) {
            setFormValues({
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                password: "",
                profile_picture: null,
            });
        }
    }, [user])


    if (loading || !user) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                Loading...
            </div>
        );
    }


    const handleChange = (e: any) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const result = await updateCurrent(user, formValues);

        if (result.success) {
            showToast("success", result.message || "Berhasil memperbaharui data", {
                duration: 800,
            })
        } else {
            if (typeof result.error == "string") {
                showToast("error", result.error || "gagal mengupdate profile")
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
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };


    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setFormValues({ ...formValues, profile_picture: file });
        }
    };

    const previewImage =
        formValues.profile_picture
            ? URL.createObjectURL(formValues.profile_picture)
            : user.profile_picture
                ? `${import.meta.env.VITE_IMAGE_URL}/user/${user.profile_picture}`
                : null;

    return (
        <div className="h-full w-full">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="update Berhasil!"
                errorTitle="update Gagal"
            />
            <main className="container mx-auto py-10 px-4">
                <div className="rounded-xl border border-black overflow-hidden">
                    <div className="p-6 border-b border-black">
                        <h1 className="text-2xl font-bold text-neutral">My Profile</h1>
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
                    />
                </div>
            </main>
        </div>
    );
}
