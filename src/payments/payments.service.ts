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
  async createPayment(
    userId: number,
    dotori: number,
    tossPaymentId: string
  ): Promise<Payment> {
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
      toss_payment_id: tossPaymentId,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    user.dotoris += dotori;
    await this.userService.save(user);

    return savedPayment;
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
