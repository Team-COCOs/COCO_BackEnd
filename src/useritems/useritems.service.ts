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

  // db 저장 및 수정
  async getOrCreateUserItem(userId: number): Promise<UserItem> {
    let userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!userItem) {
      const user = await this.usersService.findUserById(userId);
      userItem = this.userItemRepository.create({ user });
    }
    return userItem;
  }

  // 대표 미니미 설정
  async setMinimi(userId: number, purchaseId: number): Promise<number> {
    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      purchaseId
    );
    const userItem = await this.getOrCreateUserItem(userId);

    if (!purchaseId || purchaseId === 0) {
      userItem.minimiItem = null;
      await this.usersService.updateMinimiImage(userId, null);
      await this.userItemRepository.save(userItem);
      return null;
    }

    userItem.minimiItem = purchase.storeItems;

    if (userItem.minimiItem.file) {
      await this.usersService.updateMinimiImage(
        userId,
        userItem.minimiItem.file
      );
    }

    const saved = await this.userItemRepository.save(userItem);
    return saved.minimiItem.id;
  }

  // 대표 미니미 조회
  async getUserMinimi(
    userId: number
  ): Promise<{ id: number; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["minimiItem"],
    });

    if (!userItem?.minimiItem) return null;

    return {
      id: userItem.minimiItem.id,
      file: userItem.minimiItem.file,
    };
  }

  // 미니룸 배경 설정
  async setMiniRoomBack(userId: number, purchaseId: number): Promise<number> {
    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      purchaseId
    );
    if (!purchase)
      throw new Error("선택한 미니룸 배경 아이템을 구매한 내역이 없습니다.");

    const userItem = await this.getOrCreateUserItem(userId);
    userItem.skinItem = purchase.storeItems;

    if (userItem.skinItem.file) {
      await this.usersService.updateMinimiImage(userId, userItem.skinItem.file);
    }

    const saved = await this.userItemRepository.save(userItem);
    return saved.skinItem.id;
  }

  // 미니룸 배경 조회
  async getUserMiniRoom(
    userId: number
  ): Promise<{ id: number; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["skinItem"],
    });
    if (!userItem?.skinItem) return null;
    return {
      id: userItem.skinItem.id,
      file: userItem.skinItem.file,
    };
  }
}
