import { useEffect, useState } from "react";
import { Pencil, Trash2, User as UserIcon, Mail, Phone, PlusIcon } from "lucide-react";
// import { useAdminUsers } from "../../hooks/admin/adminUsers";
// import { useDeleteAdminUser } from "../../hooks/admin/useAdminDeleteUser";
import { useToast } from "../../hooks/ui/useToast";
import { Link } from "react-router";
import { Toast } from "../../components/shared/Toast";
import { useAdminUser } from "../../hooks/admin/useAdminUser";


export default function AdminUsersPage() {
    const { fetchUsers, deleteUser, users, loading } = useAdminUser()
    const { showToast, dismissToast, toast } = useToast();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (id: string) => {
        setSelectedUserId(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUserId) return;

        const result = await deleteUser(selectedUserId);
        if (result.success) {
            showToast("success", result.message || "Berhasil menghapus pengguna", {
                duration: 800,
            });
            setShowDeleteDialog(false);
            setSelectedUserId(null);
            fetchUsers();
        } else {
            if (typeof result.error === "string") {
                showToast("error", result.error);
            } else {
                showToast("error", "Gagal menghapus pengguna");
            }
        }
    };

    if (loading) {
        return (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton h-40 w-full rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full min-h-full md:p-6 flex flex-col gap-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-primary font-bold text-2xl">Daftar Pengguna</h1>
                    <span className="badge badge-ghost font-medium">{users.length} Total</span>
                </div>
                <Link to={"/admin/users/add"}>
                    <div className="w-full flex md:justify-end">
                        <button className="btn btn-sm rounded-xl btn-success w-full md:w-[20%] p-4 text-success-content">
                            <PlusIcon /> {" "} Tambah pengguna
                        </button>
                    </div>
                </Link>
                <div className="divider"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border border-black rounded-xl p-4 bg-base-100"
                    >
                        {/* USER INFO */}
                        <div className="flex items-start gap-3">
                            {/* AVATAR */}
                            <div className="avatar">
                                <div className="w-10 rounded-full bg-base-200 overflow-hidden">
                                    {user.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGE_URL}/user/${user.profile_picture}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <UserIcon size={18} className="opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* TEXT */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">
                                    {user.full_name || "Anonymous"}
                                </p>

                                <div className="mt-1 space-y-1 text-sm opacity-70">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Mail size={14} className="shrink-0" />
                                        <span className="truncate">
                                            {user.email || "Tidak ada email"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="shrink-0" />
                                        <span className="truncate">
                                            {user.phone_number || "Tidak ada telepon"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM SECTION */}
                        <div className="mt-4 pt-4 border-t border-black flex items-center justify-between">
                            {/* ROLE BADGE */}
                            <span
                                className={`badge badge-sm ${user.role === "ADMIN"
                                    ? "badge-success"
                                    : "badge-secondary"
                                    }`}
                            >
                                {user.role}
                            </span>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 md:gap-4">
                                <Link to={"/admin/users/edit/" + user.id} >
                                    <button
                                        className="btn btn-ghost btn-xs btn-square text-warning"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </Link>

                                <button
                                    className="btn btn-ghost btn-xs btn-square text-error"
                                    onClick={() => handleDeleteClick(user.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {!loading && users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <UserIcon size={48} />
                    <p className="mt-2">Belum ada data pengguna.</p>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteDialog && (
                <div className="modal modal-open">
                    <div className="modal-box bg-base-100">
                        <h3 className="font-semibold text-lg">Hapus Pengguna?</h3>
                        <p className="py-4 opacity-70">
                            Pengguna yang sudah dihapus tidak dapat dikembalikan.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setSelectedUserId(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleConfirmDelete}
                                disabled={loading}
                            >
                                {loading ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}