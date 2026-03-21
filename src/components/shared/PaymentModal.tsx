"use client"

import { useState, useRef } from "react"
import { X, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { type Order } from "../../types/order"

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtRp(n: number) {
    return "Rp " + n.toLocaleString("id-ID")
}

function fmt(iso?: string | null) {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }) + " WIB"
}

// ─── props ────────────────────────────────────────────────────────────────────

interface Props {
    order: Order
    qrisUrl?: string          // URL gambar QRIS dari BE
    isLoading?: boolean
    onSubmit: (file: File) => void
    onClose: () => void
}

// ─── step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Scan QRIS", "Upload bukti", "Konfirmasi"]

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center px-5 pb-5 gap-0">
            {STEPS.map((label, i) => {
                const idx = i + 1
                const isDone = idx < current
                const isActive = idx === current

                return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-medium transition-all
                                    ${isDone ? "bg-success border-success text-success-content"
                                        : isActive ? "bg-neutral border-neutral text-neutral-content"
                                            : "bg-base-100 border-base-300 text-base-content/40"}`}
                            >
                                {isDone ? "✓" : idx}
                            </div>
                            <span
                                className={`text-[10px] whitespace-nowrap
                                    ${isDone ? "text-success"
                                        : isActive ? "text-base-content font-medium"
                                            : "text-base-content/40"}`}
                            >
                                {label}
                            </span>
                        </div>

                        {/* connector */}
                        {i < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-[1.5px] mb-4 mx-1.5 transition-colors
                                    ${isDone ? "bg-success" : "bg-base-300"}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─── step 1: scan qris ────────────────────────────────────────────────────────

function StepQRIS({ order, qrisUrl }: { order: Order; qrisUrl: string }) {
    return (
        <div className="flex flex-col items-center gap-4 py-2">

            {/* QR image */}
            <div className="bg-base-200 border border-base-200 rounded-xl p-5 flex flex-col items-center gap-4">
                <img
                    src={qrisUrl}
                    alt="QRIS"
                    className="w-44 h-44 object-contain"
                />
                <div className="text-center">
                    <p className="text-xs text-base-content/50">Total Pembayaran</p>
                    <p className="text-2xl font-semibold mt-0.5">{fmtRp(order.total_amount)}</p>
                </div>

                {/* expires chip */}
                <div className="flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded-full px-3 py-1.5 text-xs text-warning">
                    <Clock size={11} />
                    Berlaku hingga {fmt(order.expires_at)}
                </div>
            </div>

            <p className="text-xs text-base-content/50 text-center leading-relaxed">
                Scan menggunakan aplikasi dompet digital atau<br />mobile banking kamu
            </p>

        </div>
    )
}

// ─── step 2: upload ───────────────────────────────────────────────────────────

function StepUpload({
    file,
    onFileChange,
}: {
    file: File | null
    onFileChange: (f: File) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (f) onFileChange(f)
    }

    return (
        <div className="space-y-3">

            {/* upload zone */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            <div
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-7 flex flex-col items-center gap-2.5 cursor-pointer transition-all
                    ${file
                        ? "border-success bg-success/5"
                        : "border-base-300 hover:border-base-content/30 hover:bg-base-200/50"
                    }`}
            >
                {file ? (
                    <>
                        <CheckCircle size={28} className="text-success" />
                        <p className="text-sm font-medium text-success">Foto terpilih</p>
                        <p className="text-xs text-base-content/50 text-center break-all">{file.name}</p>
                        <p className="text-xs text-base-content/40">Klik untuk ganti foto</p>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                            <Upload size={18} className="text-base-content/50" />
                        </div>
                        <p className="text-sm font-medium text-base-content">Pilih foto bukti pembayaran</p>
                        <p className="text-xs text-base-content/50">JPG, PNG — maks. 5 MB</p>
                    </>
                )}
            </div>

            {/* disclaimer */}
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3.5 flex gap-2.5 items-start">
                <AlertCircle size={14} className="text-warning shrink-0 mt-0.5" />
                <div className="text-xs text-base-content/70 leading-relaxed">
                    <p className="font-medium text-base-content mb-1">Pastikan bukti pembayaran terlihat jelas:</p>
                    <ul className="space-y-0.5 list-disc pl-3.5">
                        <li>Nominal transfer sesuai total pesanan</li>
                        <li>Tanggal &amp; waktu transaksi terbaca</li>
                        <li>Screenshot asli, bukan hasil editan</li>
                        <li>Foto tidak buram atau terpotong</li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

// ─── step 3: confirm ──────────────────────────────────────────────────────────

function StepConfirm({ order, file }: { order: Order; file: File | null }) {
    const previewUrl = file ? URL.createObjectURL(file) : null

    return (
        <div className="space-y-3">

            {/* summary card */}
            <div className="bg-base-200 rounded-xl overflow-hidden divide-y divide-base-300">

                <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-base-content/60">Order</span>
                    <span className="font-medium">#{order.id}</span>
                </div>

                <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-base-content/60">Total dibayar</span>
                    <span className="font-semibold text-success">{fmtRp(order.total_amount)}</span>
                </div>

                <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-base-content/60">Bukti transfer</span>
                    {previewUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-base-300">
                            <img src={previewUrl} alt="bukti" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <span className="text-base-content/40">—</span>
                    )}
                </div>

            </div>

            {/* info note */}
            <div className="bg-info/10 border border-info/20 rounded-xl p-3.5 flex gap-2.5 items-start">
                <AlertCircle size={14} className="text-info shrink-0 mt-0.5" />
                <p className="text-xs text-base-content/70 leading-relaxed">
                    Setelah dikirim, pesanan kamu akan diverifikasi oleh admin.
                    Proses verifikasi biasanya memakan waktu hingga 1×24 jam.
                </p>
            </div>

        </div>
    )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function PaymentModal({ order, qrisUrl = "/qris.png", isLoading = false, onSubmit, onClose }: Props) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [file, setFile] = useState<File | null>(null)

    const TITLES: Record<number, string> = {
        1: "Pembayaran QRIS",
        2: "Upload Bukti Bayar",
        3: "Konfirmasi & Kirim",
    }

    function handleNext() {
        if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3)
    }

    function handleBack() {
        if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3)
    }

    function handleSubmit() {
        if (!file) return
        onSubmit(file)
    }

    return (
        <>
            {/* backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
                <div className="bg-base-100 rounded-t-2xl w-full max-w-lg shadow-xl">

                    {/* handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-9 h-1 rounded-full bg-base-300" />
                    </div>

                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-3">
                        <h2 className="text-base font-semibold">{TITLES[step]}</h2>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center hover:bg-base-300 transition-colors"
                        >
                            <X size={13} />
                        </button>
                    </div>

                    {/* step indicator */}
                    <StepIndicator current={step} />

                    <div className="divider m-0" />

                    {/* body */}
                    <div className="px-5 py-5 max-h-[60vh] overflow-y-auto">
                        {step === 1 && <StepQRIS order={order} qrisUrl={qrisUrl} />}
                        {step === 2 && <StepUpload file={file} onFileChange={setFile} />}
                        {step === 3 && <StepConfirm order={order} file={file} />}
                    </div>

                    {/* footer */}
                    <div className="px-5 py-4 border-t border-base-200 flex gap-2.5">

                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="btn btn-ghost px-5"
                                disabled={isLoading}
                            >
                                Kembali
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 2 && !file}
                                className="btn btn-neutral flex-1"
                            >
                                Lanjut →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!file || isLoading}
                                className="btn btn-success flex-1"
                            >
                                {isLoading
                                    ? <><span className="loading loading-spinner loading-sm" /> Mengirim...</>
                                    : <><CheckCircle size={15} /> Kirim Bukti Bayar</>
                                }
                            </button>
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}