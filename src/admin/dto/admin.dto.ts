import { ApiProperty } from "@nestjs/swagger";
import { Gender, UserRole } from "../../users/users.entity";

export class AdminUserDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: "user@example.com" }) email: string;
  @ApiProperty({ example: "홍길동" }) name: string;
  @ApiProperty({ example: "010-1234-5678" }) phone: string;
  @ApiProperty({ enum: Gender, example: Gender.MAN }) gender: Gender;
  @ApiProperty({ example: "1990-01-01" }) birthday: string;
  @ApiProperty({ example: 100 }) dotoris: number;
  @ApiProperty({ example: "/avatars/avatar1.png" }) profile_image: string;
  @ApiProperty({ enum: UserRole, example: UserRole.USER }) role: UserRole;
  @ApiProperty({ example: "2024-05-01T12:00:00Z" }) created_at: string;
}

export class UserListResDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ type: [AdminUserDto] }) users: AdminUserDto[];
}

export class UserCountDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ example: 100 }) count: number;
}

export class DailyUserSignupDto {
  @ApiProperty() date: string;
  @ApiProperty() count: number;
}

export class DailySignupResDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ type: [DailyUserSignupDto] }) daily: DailyUserSignupDto[];
}

export class MonthlySignupStatDto {
  @ApiProperty() month: string;
  @ApiProperty() count: number;
}

export class MonthlySignupResDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ type: [MonthlySignupStatDto] }) data: MonthlySignupStatDto[];
}

export class PaymentDto {
  @ApiProperty() id: number;
  @ApiProperty() amount: number;
  @ApiProperty() user_id: number;
  @ApiProperty() created_at: string;
}

export class PaymentListDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ type: [PaymentDto] }) payments: PaymentDto[];
}

export class PaymentCountDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ example: 123 }) count: number;
}

export class TotalPaymentAmountDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ example: 123456 }) amount: number;
}

export class DailyPaymentAmountDto {
  @ApiProperty() date: string;
  @ApiProperty() total: number;
}

export class DailyPaymentAmountResDto {
  @ApiProperty({ example: true }) ok: boolean;
  @ApiProperty({ type: [DailyPaymentAmountDto] })
  daily: DailyPaymentAmountDto[];
}
