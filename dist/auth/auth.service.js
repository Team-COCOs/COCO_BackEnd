"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(jwtService, configService, userService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
    }
    async signUp(email, password, name, phone, gender, birthday) {
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new Error("이미 존재하는 이메일입니다.");
        }
        const hashPW = await bcrypt.hash(password, 10);
        const newUser = await this.userService.saveUser(email, hashPW, name, phone, gender, birthday);
        return { message: "회원가입 성공" };
    }
    async localLogin(email, password) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException("유저 정보 없음.");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new common_1.UnauthorizedException("비밀번호가 일치하지 않습니다.");
        }
        const { access_token, refresh_token } = await this.issueTokens(user);
        return {
            id: user.id,
            email: user.email,
            access_token,
            refresh_token,
        };
    }
    async findId(name, phone) {
        const user = await this.userService.findUserByNameAndPhone(name, phone);
        if (!user) {
            throw new common_1.NotFoundException("일치하는 회원 정보가 없습니다.");
        }
        return { email: user.email };
    }
    async resetPw(email, newPassword) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException("일치하는 회원 정보가 없습니다.");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userService.save(user);
        return { message: "비밀번호가 성공적으로 변경되었습니다." };
    }
    async changePw(userId, newPassword) {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException("유저를 찾을 수 없습니다.");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userService.save(user);
        return { message: "비밀번호가 성공적으로 변경되었습니다." };
    }
    async issueTokens(user) {
        const access_token = jwt.sign({
            id: user.id,
            role: user.role,
            isPhoneVerified: user.isPhoneVerified,
        }, this.configService.get("JWT_ACCESS_TOKEN_SECRET_KEY"), {
            expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
        });
        const refresh_token = jwt.sign({}, this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY"), {
            expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME"),
            audience: String(user.id),
        });
        user.refresh_token = refresh_token;
        await this.userService.save(user);
        return {
            access_token,
            refresh_token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map