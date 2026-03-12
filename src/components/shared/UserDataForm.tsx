import { Camera, UserIcon } from "lucide-react";
import React from "react";

interface FormValues {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    profile_picture: File | null;
    role?: string;
}

interface UserFormProps {
    formValues: FormValues;
    fieldErrors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageClick: () => void;
    previewImage: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    showRole?: boolean
}

export default function UserForm({
    formValues,
    fieldErrors,
    onChange,
    onSubmit,
    onFileChange,
    previewImage,
    onImageClick,
    fileInputRef,
    showRole
}: UserFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col-reverse md:flex-row">
                {/* LEFT */}
                <div className="flex-1 p-8 md:border-r border-black">
                    <div className="space-y-6 max-w-xl">

                        {/* FULL NAME */}
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-lg">
                                    Full Name
                                </span>
                            </label>
                            <input
                                name="full_name"
                                type="text"
                                value={formValues.full_name}
                                onChange={onChange}
                                className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.full_name ? "input-error" : ""
                                    }`}
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
                                <span className="label-text text-lg">
                                    Email
                                </span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formValues.email}
                                onChange={onChange}
                                className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.email ? "input-error" : ""
                                    }`}
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
                                <span className="label-text text-lg">
                                    Phone Number
                                </span>
                            </label>
                            <input
                                name="phone_number"
                                type="text"
                                value={formValues.phone_number}
                                onChange={onChange}
                                className={`input input-bordered border-black focus:border-primary w-full h-12 ${fieldErrors.phone_number ? "input-error" : ""
                                    }`}
                            />
                            {fieldErrors.phone_number && (
                                <div className="text-error text-sm mt-1">
                                    {fieldErrors.phone_number}
                                </div>
                            )}
                        </div>

                        {/* ROLE */}
                        {showRole && (
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-lg">Role</span>
                                </label>
                                <select
                                    name="role"
                                    value={formValues.role}
                                    onChange={onChange}
                                    className="select select-bordered border-black focus:border-primary w-full h-12"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        )}

                        {/* PASSWORD */}
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-lg">
                                    Password
                                </span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formValues.password}
                                onChange={onChange}
                                className={`input input-bordered border-warning focus:border-warning w-full h-12 ${fieldErrors.password ? "input-error" : ""
                                    }`}
                                placeholder="Enter new password"
                            />
                            {fieldErrors.password && (
                                <div className="text-error text-sm mt-1">
                                    {fieldErrors.password}
                                </div>
                            )}
                            <p className="text-warning text-sm mt-1">
                                Password will be changed immediately if filled.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-center">
                            <button
                                type="submit"
                                className="btn btn-primary px-12 rounded-full text-lg"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center">
                    <div
                        className="relative w-48 h-48 rounded-full border border-black overflow-hidden cursor-pointer group"
                        onClick={onImageClick}
                    >
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">

                                <UserIcon size={32} className="opacity-50" />

                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onFileChange}
                    />
                </div>
            </div>
        </form>
    );
}