import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { UsersService } from "../users/users.service";
import { Gender, User } from "../users/users.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginResponseDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {}

  // 회원가입
  async signUp(
    email: string,
    password: string,
    name: string,
    phone: string,
    gender: Gender,
    birthday: string
  ) {
    // 비밀번호
    const hashPW = await bcrypt.hash(password, 10);

    const newUser = await this.userService.saveUser(
      email,
      hashPW,
      name,
      phone,
      gender,
      birthday
    );

    return { message: "회원가입 성공" };
  }

  // 회원가입 중복 검사
  async checkDuplicate(
    type: "email" | "phone",
    body: { email?: string; phone?: string }
  ): Promise<boolean> {
    if (type === "email") {
      const user = await this.userService.findUserByEmail(body.email!);
      return !!user;
    } else if (type === "phone") {
      const user = await this.userService.findUserByPhone(body.phone!);
      return !!user;
    } else {
      throw new Error("지원하지 않는 타입입니다.");
    }
  }

  // 로그인
  async localLogin(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException("유저 정보 없음.");
    }

    // 비밀번호 검증
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    // 토큰 발급
    const { access_token, refresh_token } = await this.issueTokens(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      profile_image: user.profile_image,
      role: user.role,
      dotoris: user.dotoris,
      birthday: user.birthday,
      access_token,
      refresh_token,
    };
  }

  // 아이디 찾기
  async findId(name: string, phone: string): Promise<{ email: string }> {
    const user = await this.userService.findUserByNameAndPhone(name, phone);

    if (!user) {
      throw new NotFoundException("일치하는 회원 정보가 없습니다.");
    }

    return { email: user.email };
  }

  // 새 비밀번호 발급
  async resetPw(
    email: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException("일치하는 회원 정보가 없습니다.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userService.save(user);

    return { message: "비밀번호가 성공적으로 변경되었습니다." };
  }

  // 비밀번호 변경
  async changePw(
    userId: number,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userService.save(user);

    return { message: "비밀번호가 성공적으로 변경되었습니다." };
  }

  // access 토큰 및 refresh 토큰
  async issueTokens(
    user: User
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      this.configService.get("JWT_ACCESS_TOKEN_SECRET_KEY")!,
      {
        expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
      }
    );

    const refresh_token = jwt.sign(
      {},
      this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY")!,
      {
        expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME"),
        audience: String(user.id),
      }
    );

    user.refresh_token = refresh_token;
    await this.userService.save(user);

    return {
      access_token,
      refresh_token,
    };
  }
}
