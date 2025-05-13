import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Purchase } from "./purchases.entity";
import { UsersService } from "../users/users.service";
import { StoreitemsService } from "../storeitems/storeitems.service";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly usersService: UsersService,
    private readonly storeitemsService: StoreitemsService
  ) {}

  // 아이템 구매
  async buyItem(userId: number, storeItemId: number) {
    const user = await this.usersService.findUserById(userId);
    const item = await this.storeitemsService.findItemById(storeItemId);

    if (!item) throw new NotFoundException("스토어 아이템을 찾을 수 없습니다.");

    // 중복 구매 확인
    const existing = await this.purchaseRepository.findOne({
      where: { user: { id: userId }, storeItems: { id: storeItemId } },
    });

    if (existing) {
      throw new BadRequestException("이미 구매한 아이템입니다.");
    }

    if (user.dotoris < item.price) {
      throw new BadRequestException("도토리가 부족합니다.");
    }

    // 도토리 차감
    user.dotoris -= item.price;
    await this.usersService.save(user);

    // 구매 저장
    const purchase = this.purchaseRepository.create({
      user,
      storeItems: item,
    });
    return this.purchaseRepository.save(purchase);
  }

  // 아이템 찾기
  async getPurchasesItems(
    userId: number,
    storeItemId: number
  ): Promise<Purchase | null> {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        user: { id: userId },
        storeItems: { id: storeItemId },
      },
      relations: ["storeItems"],
    });

    return purchase;
  }

  // 구매한 유저 확인
  async getUserPurchases(userId: number) {
    return this.purchaseRepository.find({
      where: { user: { id: userId } },
      relations: ["storeItems"],
      order: { acquired_at: "DESC" },
    });
  }
}
