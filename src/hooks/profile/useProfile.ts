import { useState } from "react"
import type { UpdateUserData, User } from "../../types/user"
import { useUserApi } from "../user/useUser";

export function useProfiles() {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const { getMyProfile, updateCurrentUser } = useUserApi()

    const getCurrentUser = async () => {
        setLoading(true)
        const response = await getMyProfile()
        setLoading(false)
        if (response.success) {
            setUser(response.user)
        } else {
            return response
        }
    }

    const updateCurrent = async (initial: User, formValues: UpdateUserData) => {
        const response = await updateCurrentUser(initial, formValues)
        return response

    }


    return { user, loading, getCurrentUser, updateCurrent }
}