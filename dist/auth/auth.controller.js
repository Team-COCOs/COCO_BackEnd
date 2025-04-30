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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    constructor(authService, configService, usersService) {
        this.authService = authService;
        this.configService = configService;
        this.usersService = usersService;
    }
    async signUp(body) {
        const { email, password, name, phone, gender, birthday } = body;
        return await this.authService.signUp(email, password, name, phone, gender, birthday);
    }
    async login(body) {
        const { email, password } = body;
        return await this.authService.localLogin(email, password);
    }
    async findId(body) {
        const { name, phone } = body;
        return await this.authService.findId(name, phone);
    }
    async resetPassword(body) {
        const { email, newPassword } = body;
        return await this.authService.resetPw(email, newPassword);
    }
    async changePassword(req, body) {
        const userId = req.user["id"];
        return await this.authService.changePw(userId, body.newPassword);
    }
    async refresh(req) {
        const authHeader = req.headers["authorization"];
        const refresh_token = authHeader?.split(" ")[1];
        if (!refresh_token) {
            return { ok: false, error: "Refresh token이 없습니다." };
        }
        try {
            const decoded = jwt.verify(refresh_token, this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY"));
            const user = await this.usersService.findUserById(Number(decoded.aud));
            if (!user || user.refresh_token !== refresh_token) {
                return { ok: false, error: "토큰이 만료되었거나 일치하지 않습니다." };
            }
            const { access_token } = await this.authService.issueTokens(user);
            if (!access_token) {
                return { ok: false, error: "access_token 발급 실패" };
            }
            return { ok: true, access_token, refresh_token };
        }
        catch (err) {
            return { ok: false, error: "토큰 검증 실패" };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("findId"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findId", null);
__decorate([
    (0, common_1.Patch)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)("change-password"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map