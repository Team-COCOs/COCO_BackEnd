export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string | null;
    phone: string | null;
    isPhoneVerified: boolean;
    gender: Gender | null;
    profile_image: string;
    minimi_image: string;
    role: UserRole;
    dotoris: number;
    refresh_token: string | null;
    birthday: string;
    created_at: Date;
    updated_at: Date;
}
