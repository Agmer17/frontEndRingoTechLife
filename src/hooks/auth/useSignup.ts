import { useUserApi } from "../user/useUser";


interface signUpData {
    full_name: string
    email: string
    phone_number: string
    password: string
}

export const useSignup = () => {

    const { createUser } = useUserApi()

    const signUp = async ({ full_name, email, phone_number, password }: signUpData) => {

        const response = await createUser({ full_name, email, phone_number, password })

        return response
    }

    return { signUp }

}