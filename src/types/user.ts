export interface User {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    profile_picture: string | null;
}

export interface UserProfile {
    full_name: string;
    email: string;
    phone_number: string;
    profile_picture?: string;
}


export const errorKeyMap: Record<string, string> = {
    FullName: "full_name",
    Email: "email",
    PhoneNumber: "phone_number",
    Password: "password",
    Role: "role",
}

export interface CreateUserData {
    full_name: string
    email: string
    phone_number: string
    password: string
}


export interface UpdateUserData {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    profile_picture: File | null;
    role?: string
}