import { Request } from "express";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly usersService;
    constructor(authService: AuthService, configService: ConfigService, usersService: UsersService);
    signUp(body: any): Promise<{
        message: string;
    }>;
    login(body: any): Promise<{
        id: number;
        email: string;
        access_token: string;
        refresh_token: string;
    }>;
    findId(body: {
        name: string;
        phone: string;
    }): Promise<{
        email: string;
    }>;
    resetPassword(body: {
        email: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    changePassword(req: Request, body: {
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    refresh(req: Request): Promise<{
        ok: boolean;
        access_token?: string;
        refresh_token?: string;
        error?: string;
    }>;
}
