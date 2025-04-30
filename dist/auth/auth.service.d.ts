import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { Gender, User } from "../users/users.entity";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UsersService);
    signUp(email: string, password: string, name: string, phone: string, gender: Gender, birthday: string): Promise<{
        message: string;
    }>;
    localLogin(email: string, password: string): Promise<{
        id: number;
        email: string;
        access_token: string;
        refresh_token: string;
    }>;
    findId(name: string, phone: string): Promise<{
        email: string;
    }>;
    resetPw(email: string, newPassword: string): Promise<{
        message: string;
    }>;
    changePw(userId: number, newPassword: string): Promise<{
        message: string;
    }>;
    issueTokens(user: User): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
