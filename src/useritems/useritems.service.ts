import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserItem } from "./useritems.entity";
import { PurchasesService } from "src/purchases/purchases.service";

@Injectable()
export class UseritemsService {
  @InjectRepository(UserItem)
  private readonly userItemRepository: Repository<UserItem>;
  private readonly purchasesService: PurchasesService;

  // 미니미 저장
  async setMinimi(userId: number, storeItemId: number): Promise<number> {
    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      storeItemId
    );

    if (!purchase) {
      throw new Error("선택한 미니미 아이템을 구매한 내역이 없습니다.");
    }

    const userItem = new UserItem();
    userItem.user = purchase.user;
    userItem.minimiItem = purchase.storeItems;

    const savedUserItem = await this.userItemRepository.save(userItem);

    return savedUserItem.minimiItem.id;
  }

  // 미니미 조회
  async getMinimi(userId: number, minimiId: number): Promise<UserItem> {
    const minimi = await this.userItemRepository.findOne({
      where: { user: { id: userId }, minimiItem: { id: minimiId } },
      relations: ["minimiItem"],
    });

    if (!minimi) {
      throw new Error("선택한 미니미 아이템을 저장한 내역이 없습니다.");
    }

    return minimi;
  }
}
