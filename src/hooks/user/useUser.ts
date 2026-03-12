import axiosInstance from "../../lib/axios"
import type { CreateUserData, UpdateUserData, User } from "../../types/user"
import { handleApiError } from "../../utils/errorUtils"

export function useUserApi() {

    const createUser = async ({ full_name, email, phone_number, password }: CreateUserData) => {
        try {
            const response = await axiosInstance.post("/auth/sign-up", {
                full_name,
                email,
                phone_number,
                password
            })
            const resData = response.data
            return { success: true as const, message: resData.message, data: resData.data }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const getAllUser = async () => {
        try {
            const response = await axiosInstance.get("/user/get-all");
            const responseData = response.data.data as User[];
            const message = response.data.message;

            return { success: true as const, message, data: responseData };
        } catch (error) {
            return handleApiError(error)
        }
    }

    const getUserById = async (id: string) => {
        try {
            const response = await axiosInstance.get("/user/id/" + id);
            const userData = response.data.data as User;
            const message = response.data.message;

            return { success: true as const, message, data: userData }
        } catch (error) {
            return handleApiError(error)
        }
    }

    const remove = async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/user/${id}`);
            const message = response.data.mesage;

            return { success: true as const, message, data: null };
        } catch (error) {
            return handleApiError(error)
        }
    }

    const update = async (initialUser: User | null, id: string, formValues: UpdateUserData) => {
        if (!initialUser) {
            return {
                success: false as const,
                error: "User data not found",
            };
        }

        const formData = new FormData();

        if (formValues.full_name !== initialUser.full_name) {
            formData.append("full_name", formValues.full_name);
        }

        if (formValues.email !== initialUser.email) {
            formData.append("email", formValues.email);
        }

        if (formValues.phone_number !== initialUser.phone_number) {
            formData.append("phone_number", formValues.phone_number);
        }

        if (formValues.role != null && formValues.role !== initialUser.role) {
            formData.append("role", formValues.role);
        }

        if (formValues.password.trim() !== "") {
            console.log(formValues.password)
            formData.append("password", formValues.password);
        }

        if (formValues.profile_picture) {
            formData.append("profile_picture", formValues.profile_picture);
        }


        if ([...formData.entries()].length === 0) {
            return {
                success: true as const,
                message: "berhasil menyimpan data",
                data: null
            };
        }

        try {
            const response = await axiosInstance.put(
                "/user/" + id,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return {
                success: true as const,
                message: response.data.message,
            };
        } catch (error) {
            return handleApiError(error);
        }
    }

    const updateCurrentUser = async (initialUser: User, formValues: UpdateUserData) => {
        if (!initialUser) {
            return {
                success: false as const,
                error: "User data not found",
            };
        }
        const formData = new FormData();

        if (formValues.full_name !== initialUser.full_name) {
            formData.append("full_name", formValues.full_name);
        }

        if (formValues.email !== initialUser.email) {
            formData.append("email", formValues.email);
        }

        if (formValues.phone_number !== initialUser.phone_number) {
            formData.append("phone_number", formValues.phone_number);
        }

        if (formValues.password.trim() !== "") {
            formData.append("password", formValues.password);
        }

        if (formValues.profile_picture) {
            formData.append("profile_picture", formValues.profile_picture);
        }

        if ([...formData.entries()].length === 0) {
            return {
                success: true as const,
                error: "berhasil menyimpan data",
            };
        }
        try {
            const response = await axiosInstance.put(
                "/user/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return {
                success: true as const,
                message: response.data.message,
            };
        } catch (error) {
            return handleApiError(error)
        }
    }


    const getMyProfile = async () => {
        try {
            const response = await axiosInstance.get("/user/profile/me")
            const message = response.data.message
            const userData = response.data.data as User

            return { success: true as const, message, user: userData }
        } catch (error) {
            return handleApiError(error)
        } finally {
        }
    }


    return { createUser, getAllUser, getUserById, remove, update, updateCurrentUser, getMyProfile }

}