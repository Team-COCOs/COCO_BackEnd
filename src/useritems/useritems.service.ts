import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LanguageType, UserItem } from "./useritems.entity";
import { PurchasesService } from "src/purchases/purchases.service";
import { UsersService } from "src/users/users.service";
import { MiniroomsService } from "src/minirooms/minirooms.service";

@Injectable()
export class UseritemsService {
  constructor(
    @InjectRepository(UserItem)
    private readonly userItemRepository: Repository<UserItem>,
    private readonly purchasesService: PurchasesService,

    @Inject(forwardRef(() => MiniroomsService))
    private readonly miniroomService: MiniroomsService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  // db 저장 및 수정
  async getOrCreateUserItem(userId: number): Promise<UserItem> {
    let userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!userItem) {
      const user = await this.usersService.findUserById(userId);
      userItem = this.userItemRepository.create({
        user,
        taps: ["diary", "visitor", "photo", "coco"],
      });
      userItem = await this.userItemRepository.save(userItem);
    } else if (!userItem.taps || userItem.taps.length === 0) {
      userItem.taps = ["diary", "visitor", "photo", "coco"];
      await this.userItemRepository.save(userItem);
    }
    return userItem;
  }

  // 대표 미니미 설정
  async setMinimi(
    userId: number,
    purchaseId: number | "default-minimi"
  ): Promise<number | null> {
    const userItem = await this.getOrCreateUserItem(userId);

    if (purchaseId === "default-minimi") {
      userItem.minimiItem = null;

      await this.usersService.updateMinimiImage(userId, null);

      await this.userItemRepository.save(userItem);
      return null;
    }

    const purchase = await this.purchasesService.getPurchaseById(
      userId,
      purchaseId
    );

    if (!purchase) {
      throw new Error("선택한 미니미 아이템을 구매한 내역이 없습니다.");
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

    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      userItem.minimiItem.id
    );

    return {
      id: purchase ? purchase.id : null,
      file: userItem.minimiItem.file,
    };
  }

  // 미니룸 배경 설정
  async setMiniRoomBack(
    userId: number,
    purchaseId: number | "default-miniroom"
  ): Promise<number | null> {
    // 기본 배경으로 되돌릴 경우
    if (purchaseId === "default-miniroom") {
      const userItem = await this.getOrCreateUserItem(userId);
      userItem.miniroomItem = null;
      await this.userItemRepository.save(userItem);

      await this.miniroomService.updateMiniroomBackground(
        userId,
        "default-miniroom"
      );

      return null;
    }

    // 유저가 구매한 아이템인지 검증
    const purchase = await this.purchasesService.getPurchaseById(
      userId,
      purchaseId
    );
    if (!purchase)
      throw new Error("선택한 미니룸 배경 아이템을 구매한 내역이 없습니다.");

    const userItem = await this.getOrCreateUserItem(userId);
    userItem.miniroomItem = purchase.storeItems;

    await this.userItemRepository.save(userItem);

    await this.miniroomService.updateMiniroomBackground(
      userId,
      purchase.storeItems.id
    );

    return purchase.storeItems.id;
  }

  // 미니룸 배경 조회
  async getUserMiniRoom(
    userId: number
  ): Promise<{ id: number | null; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["miniroomItem"],
    });

    if (!userItem?.miniroomItem) return null;

    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      userItem.miniroomItem.id
    );

    return {
      id: purchase ? purchase.id : null,
      file: userItem.miniroomItem.file,
    };
  }

  // 대표 bgm 설정
  async setBGM(userId: number, purchaseId: number): Promise<number> {
    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      purchaseId
    );
    const userItem = await this.getOrCreateUserItem(userId);

    if (!purchase)
      throw new Error("선택한 미니룸 배경 아이템을 구매한 내역이 없습니다.");

    userItem.bgmItem = purchase.storeItems;

    const saved = await this.userItemRepository.save(userItem);
    return saved.bgmItem.id;
  }

  // 대표 bgm 조회
  async getUserBGM(
    userId: number
  ): Promise<{ id: number; file: string; name: string; artist: string }[]> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["bgmItem"],
    });

    if (!userItem?.bgmItem) return [];

    return [
      {
        id: userItem.bgmItem.id,
        file: userItem.bgmItem.file,
        name: userItem.bgmItem.name,
        artist: userItem.bgmItem.artist,
      },
    ];
  }

  // 탭 설정
  async setTabs(userId: number, taps: string[]): Promise<string[]> {
    const userItem = await this.getOrCreateUserItem(userId);
    userItem.taps = taps;
    const saved = await this.userItemRepository.save(userItem);
    return saved.taps;
  }

  // 탭 조회
  async getTabs(userId: number): Promise<string[]> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
    });

    return userItem?.taps ?? [];
  }

  // 언어 설정
  async setLanguage(
    userId: number,
    language: LanguageType
  ): Promise<LanguageType> {
    const userItem = await this.getOrCreateUserItem(userId);
    userItem.language = language;
    const saved = await this.userItemRepository.save(userItem);
    return saved.language;
  }

  // 언어 조회
  async getUserLanguage(userId: number): Promise<LanguageType> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
    });
    return userItem?.language ?? LanguageType.KO;
  }

  // 미니홈피 스킨 저장
  async setMinihomepis(
    userId: number,
    purchaseId: number | "default-minihomepis"
  ): Promise<number | null> {
    const userItem = await this.getOrCreateUserItem(userId);

    if (purchaseId === "default-minihomepis") {
      userItem.skinItem = null;

      await this.usersService.updateMinimiImage(userId, null);

      await this.userItemRepository.save(userItem);
      return null;
    }

    const purchase = await this.purchasesService.getPurchaseById(
      userId,
      purchaseId
    );

    if (!purchase) {
      throw new Error("선택한 미니홈피 아이템을 구매한 내역이 없습니다.");
    }

    userItem.skinItem = purchase.storeItems;

    const saved = await this.userItemRepository.save(userItem);
    return saved.skinItem.id;
  }

  // 미니홈피 스킨 조회
  async getUserMinihomepis(
    userId: number
  ): Promise<{ id: number; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["skinItem"],
    });

    if (!userItem?.skinItem) return null;

    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      userItem.skinItem.id
    );

    return {
      id: purchase ? purchase.id : null,
      file: userItem.skinItem.file,
    };
  }

  // 미니홈피 탭 컬러 저장
  async setTapColor(
    userId: number,
    purchaseId: number | "default-tapcolor"
  ): Promise<number | null> {
    const userItem = await this.getOrCreateUserItem(userId);

    if (purchaseId === "default-tapcolor") {
      userItem.tapColorItem = null;

      await this.usersService.updateMinimiImage(userId, null);

      await this.userItemRepository.save(userItem);
      return null;
    }

    const purchase = await this.purchasesService.getPurchaseById(
      userId,
      purchaseId
    );

    if (!purchase) {
      throw new Error("선택한 탭 컬러를 구매한 내역이 없습니다.");
    }

    userItem.tapColorItem = purchase.storeItems;

    const saved = await this.userItemRepository.save(userItem);
    return saved.tapColorItem.id;
  }

  // 미니홈피 탭 컬러 조회
  async getUserTapColor(
    userId: number
  ): Promise<{ id: number; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["tapColorItem"],
    });

    if (!userItem?.tapColorItem) return null;

    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      userItem.tapColorItem.id
    );

    return {
      id: purchase ? purchase.id : null,
      file: userItem.tapColorItem.file,
    };
  }

  // 다이어리 배경 저장
  async setBK(
    userId: number,
    purchaseId: number | "default-bk"
  ): Promise<number | null> {
    const userItem = await this.getOrCreateUserItem(userId);

    if (purchaseId === "default-bk") {
      userItem.diaryBackgroundItem = null;

      await this.usersService.updateMinimiImage(userId, null);

      await this.userItemRepository.save(userItem);
      return null;
    }

    const purchase = await this.purchasesService.getPurchaseById(
      userId,
      purchaseId
    );

    if (!purchase) {
      throw new Error("선택한 배경을 구매한 내역이 없습니다.");
    }

    userItem.diaryBackgroundItem = purchase.storeItems;

    const saved = await this.userItemRepository.save(userItem);
    return saved.diaryBackgroundItem.id;
  }

  // 미니홈피 스킨 조회
  async getUserBK(
    userId: number
  ): Promise<{ id: number; file: string } | null> {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId } },
      relations: ["skinItem"],
    });

    if (!userItem?.diaryBackgroundItem) return null;

    const purchase = await this.purchasesService.getPurchasesItems(
      userId,
      userItem.diaryBackgroundItem.id
    );

    return {
      id: purchase ? purchase.id : null,
      file: userItem.diaryBackgroundItem.file,
    };
  }
}
