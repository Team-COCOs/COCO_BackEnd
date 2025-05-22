import { ForbiddenException, Injectable } from "@nestjs/common";
import { PaymentsService } from "../payments/payments.service";
import { UsersService } from "../users/users.service";
import { UserRole } from "../users/users.entity";
import { PhotosService } from "src/photos/photos.service";
import { DiaryService } from "src/diary/diary.service";

interface AdminRequest {
  id: number;
  role: UserRole;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly photosService: PhotosService,
    private readonly diaryService: DiaryService
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

  // 유저 탈퇴 유저로 변경
  async withDrawUserByAdmin(requester: AdminRequest, userId: number) {
    this.checkAdmin(requester);
    return this.usersService.withdrawUser(userId);
  }

  // 일별 가입자 수
  async todaySignupUser(requester: AdminRequest) {
    this.checkAdmin(requester);
    return this.usersService.countTodaySignups();
  }

  // 월별 가입자 수
  async totalSignupUser(requester: AdminRequest) {
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
}
