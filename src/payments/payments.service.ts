import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./payments.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UsersService
  ) {}

  private readonly priceMap: Record<number, number> = {
    10: 1000,
    30: 3000,
    50: 5000,
    100: 9500,
  };

  // 결제하기
  async createPayment(userId: number, dotori: number): Promise<Payment> {
    const amount = this.priceMap[dotori];
    if (!amount) {
      throw new BadRequestException("유효하지 않은 도토리 개수입니다.");
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException("User 정보를 찾을 수 없습니다.");
    }

    const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = this.paymentRepository.create({
      user,
      dotori_amount: dotori,
      amount,
      order_id: orderId,
    });
    return this.paymentRepository.save(payment);
  }

  // 결제 상태 업로드
  async updatePaymentStatus(
    orderId: string,
    tossPaymentId: string
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
      relations: ["user"],
    });

    if (!payment) {
      throw new NotFoundException("해당 order_id의 결제 기록이 없습니다.");
    }

    // 결제 고유 ID 저장
    payment.toss_payment_id = tossPaymentId;
    await this.paymentRepository.save(payment);

    // 유저 도토리 충전
    // `user` 엔티티에 `dotori` 필드가 있다고 가정합니다.
    payment.user.dotoris = (payment.user.dotoris || 0) + payment.dotori_amount;
    await this.userService.save(payment.user);

    return payment;
  }

  async getPaymentByUser(userId: number) {
    return this.paymentRepository.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }

  // 관리자 페이지 결제 내역
  async allPayments() {
    return this.paymentRepository.find();
  }
}
