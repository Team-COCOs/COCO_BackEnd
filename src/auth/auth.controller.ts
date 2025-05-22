import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { SignUpDto } from "./dto/signup.dto";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { FindIdRequestDto } from "./dto/findId.dto";
import { ResetPasswordDto } from "./dto/password.dto";
import { CheckDuplicateRequestDto } from "./dto/check-duplicate.dto";
import * as jwt from "jsonwebtoken";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  async signUp(@Body() body: SignUpDto) {
    const { email, password, name, phone, gender, birthday } = body;
    return await this.authService.signUp(
      email,
      password,
      name,
      phone,
      gender,
      birthday
    );
  }

  @Post("check/:type")
  @ApiOperation({ summary: "회원가입 중복 체크 (email 또는 phone)" })
  @ApiBody({ type: CheckDuplicateRequestDto })
  async checkDuplicate(
    @Param("type") type: "email" | "phone",
    @Body() body: CheckDuplicateRequestDto
  ) {
    const exists = await this.authService.checkDuplicate(type, body);
    return { exists };
  }

  @Post("localLogin")
  @ApiOperation({ summary: "이메일/비밀번호 로그인" })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    type: LoginResponseDto,
  })
  async login(@Body() body: LoginRequestDto) {
    const { email, password } = body;
    return await this.authService.localLogin(email, password);
  }

  @Post("findId")
  @ApiOperation({ summary: "아이디(이메일) 찾기" })
  @ApiBody({ type: FindIdRequestDto })
  async findId(@Body() body: FindIdRequestDto) {
    const { name, phone } = body;
    return await this.authService.findId(name, phone);
  }

  @Patch("reset-password")
  @ApiOperation({ summary: "비밀번호 재설정" })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, phone, newPassword } = body;
    return await this.authService.resetPw(email, phone, newPassword);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Access Token 재발급 (Refresh Token 필요)" })
  async refresh(@Req() req: Request): Promise<{
    ok: boolean;
    access_token?: string;
    refresh_token?: string;
    error?: string;
  }> {
    const authHeader = req.headers["authorization"];
    const refresh_token = authHeader?.split(" ")[1];

    if (!refresh_token) {
      return { ok: false, error: "Refresh token이 없습니다." };
    }

    try {
      const decoded = jwt.verify(
        refresh_token,
        this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET_KEY")!
      ) as any;

      const user = await this.usersService.findUserById(Number(decoded.aud));
      if (!user || user.refresh_token !== refresh_token) {
        return { ok: false, error: "토큰이 만료되었거나 일치하지 않습니다." };
      }

      const { access_token } = await this.authService.issueTokens(user);

      if (!access_token) {
        return { ok: false, error: "access_token 발급 실패" };
      }

      return { ok: true, access_token, refresh_token };
    } catch (err) {
      return { ok: false, error: "토큰 검증 실패" };
    }
  }
}
