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

  // 유저 결제 정보
  async getPaymentByUser(userId: number) {
    return this.paymentRepository.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }

  // 관리자 페이지 결제 내역
  async allPayments() {
    const payments = await this.paymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.user", "user")
      .select([
        "payment.id",
        "payment.order_id",
        "payment.amount",
        "payment.dotori_amount",
        "payment.created_at",
        "payment.toss_payment_id",
        "user.name",
        "user.email",
        "user.role",
      ])
      .getMany();

    return payments.map((payment) => ({
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      dotori_amount: payment.dotori_amount,
      created_at: payment.created_at,
      toss_payment_id: payment.toss_payment_id,
      name: payment.user.name,
      email: payment.user.email,
      role: payment.user.role,
    }));
  }

  // 관리자 페이지 결제 내역 수
  async countPayments() {
    return this.paymentRepository.count();
  }

  // 총 결제 금액
  async totalPaymentAmount(): Promise<number> {
    const { sum } = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "sum")
      .getRawOne<{ sum: string }>();

    return parseInt(sum ?? "0", 10);
  }

  // 일별 결제 금액
  async dailyPaymentAmounts(): Promise<{ date: string; total: number }[]> {
    const rawResults = await this.paymentRepository
      .createQueryBuilder("payment")
      .select(
        "DATE_FORMAT(DATE_ADD(payment.created_at, INTERVAL 9 HOUR), '%Y-%m-%d')",
        "date"
      )
      .addSelect("SUM(payment.amount)", "total")
      .groupBy("date")
      .orderBy("date", "DESC")
      .getRawMany<{ date: string; total: string }>();

    return rawResults.map((r) => ({
      date: r.date,
      total: parseInt(r.total, 10),
    }));
  }
}
