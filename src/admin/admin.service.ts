import { ForbiddenException, Injectable } from "@nestjs/common";
import { PaymentsService } from "../payments/payments.service";
import { UsersService } from "../users/users.service";
import { UserRole } from "../users/users.entity";

interface AdminRequest {
  id: number;
  role: UserRole;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService
  ) {}

  // 관리자 확인
  private checkAdmin(requester: AdminRequest) {
    if (requester.role !== UserRole.ADMIN) {
      throw new ForbiddenException("관리자만 접근할 수 있습니다.");
    }
  }

  // 유저 목록 전체 조회
  async getAllUsers(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.findAllUser();
  }

  // 유저 삭제
  async deleteUserAsAdmin(userId: number, requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.deleteUser({
      targetUserId: userId,
      requester,
    });
  }

  // 총 가입자 수
  async totalSignupUser(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.getUserCount();
  }

  // 일별 가입자 수
  async todaySignupUser(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.countRecentSignups();
  }

  // 월별 가입자 수
  async monthSignupUser(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.countMonthlySignups();
  }

  // 결제 내역
  async getAllPayments(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.paymentsService.allPayments();
  }

  // 결제 내역 수
  async getPaymentsCount(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.paymentsService.countPayments();
  }

  // 총 결제 금액
  async getTotalPaymentAmount(requester: AdminRequest): Promise<number> {
    this.checkAdmin(requester);
    return this.paymentsService.totalPaymentAmount();
  }

  // 일별 결제 금액
  async getDailyPaymentAmounts(
    requester: AdminRequest
  ): Promise<{ date: string; total: number }[]> {
    this.checkAdmin(requester);
    return this.paymentsService.dailyPaymentAmounts();
  }
}
