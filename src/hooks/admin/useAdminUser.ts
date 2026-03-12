import { useState } from "react";
import type { CreateUserData, UpdateUserData, User } from "../../types/user";
import { useUserApi } from "../user/useUser";
import { useSelector } from "react-redux";

export function useAdminUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { getAllUser, remove, getUserById, update, createUser } = useUserApi()
    const currentAdminId = useSelector((state: any) => state.auth.id);

    // buat userById
    const [user, setUser] = useState<User | null>(null)


    const fetchUsers = async () => {
        setLoading(true)
        const response = await getAllUser()
        if (response.success) {
            setUsers(response.data.filter(
                (data) => data.id != currentAdminId
            ))

            console.log(response.data)
        } else {
            return response
        }
        setLoading(false)
    }

    const deleteUser = async (id: string) => {
        setLoading(true)
        const response = await remove(id)
        setLoading(false)

        return response
    }

    const getByUserId = async (id: string) => {
        setLoading(true)
        const response = await getUserById(id)
        setLoading(false)
        if (response.success) {
            setUser(response.data)
            return response
        } else {
            return response
        }

    }


    const updateUser = async (id: string, formValues: UpdateUserData) => {
        setLoading(true)
        const response = await update(user, id, formValues)
        setLoading(false)
        return response
    }

    const create = async (data: CreateUserData) => {
        setLoading(true)
        const response = await createUser(data)
        setLoading(false)

        return response
    }


    return { users, loading, fetchUsers, deleteUser, user, getByUserId, updateUser, create }
}