import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserItem } from "./useritems.entity";
import { PurchasesService } from "src/purchases/purchases.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class UseritemsService {
  constructor(
    @InjectRepository(UserItem)
    private readonly userItemRepository: Repository<UserItem>,
    private readonly purchasesService: PurchasesService,
    private readonly usersService: UsersService
  ) {}

  // 대표 미니미 저장
  async setMinimi(userId: number, purchaseId: number): Promise<number> {
    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      purchaseId
    );

    if (!purchase) {
      throw new Error("선택한 미니미 아이템을 구매한 내역이 없습니다.");
    }

    const userItem = new UserItem();
    userItem.user = purchase.user;

    userItem.minimiItem = purchase.storeItems;

    if (userItem.minimiItem.file) {
      await this.usersService.updateMinimiImage(
        userId,
        userItem.minimiItem.file
      );
    }

    const savedUserItem = await this.userItemRepository.save(userItem);

    return savedUserItem.minimiItem.id;
  }

  // 대표 미니미 조회
  async getUserMinimi(userId: number): Promise<string | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["minimiItem"],
    });

    if (!userItem?.minimiItem) return null;
    return userItem.minimiItem.file;
  }
}
