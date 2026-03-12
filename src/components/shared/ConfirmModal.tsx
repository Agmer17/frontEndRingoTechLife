interface ConfirmDialogProps {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    variant?: "error" | "warning" | "primary"
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    loading = false,
    variant = "error",
    onConfirm,
    onCancel
}: ConfirmDialogProps) {

    if (!open) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box bg-base-100">
                <h3 className="font-semibold text-lg">{title}</h3>

                <p className="py-4 opacity-70">
                    {message}
                </p>

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className={`btn btn-${variant}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}