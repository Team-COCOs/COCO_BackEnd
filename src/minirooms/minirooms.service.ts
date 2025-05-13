import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SpeechBubble } from "./speechBubble.entity";
import { MiniRoom } from "../minirooms/minirooms.entity";
import { StoreitemsService } from "src/storeitems/storeitems.service";
import { Minimi } from "./minimi.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class MiniroomsService {
  constructor(
    @InjectRepository(SpeechBubble)
    private readonly bubbleRepository: Repository<SpeechBubble>,

    @InjectRepository(MiniRoom)
    private readonly miniRoomRepository: Repository<MiniRoom>,

    @InjectRepository(Minimi)
    private readonly MinimiRepository: Repository<Minimi>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly storeItemService: StoreitemsService
  ) {}

  // 미니룸 생성
  async saveMiniroom(userId: number): Promise<MiniRoom> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    const miniroom = this.miniRoomRepository.create({
      user,
    });

    return await this.miniRoomRepository.save(miniroom);
  }

  // 미니룸 타이틀 저장
  async saveMiniroomName(userId: number, title: string): Promise<void> {
    let miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!miniroom) {
      throw new NotFoundException("미니룸이 존재하지 않습니다.");
    } else {
      miniroom.title = title;
    }

    miniroom.title = title;
    await this.miniRoomRepository.save(miniroom);
  }

  // 미니룸 타이틀 조회
  async getMiniroomName(userId: number): Promise<{ title: string | null }> {
    const miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!miniroom) {
      return {
        title: null,
      };
    }

    return {
      title: miniroom.title,
    };
  }

  // 미니룸 레이아웃 저장 (미니미, 말풍선)
  async saveMiniroomLayoutByUser(userId: number, items: any[]): Promise<void> {
    let miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!miniroom) {
      const user = await this.usersService.findUserById(userId);
      miniroom = this.miniRoomRepository.create({ user });
      miniroom = await this.miniRoomRepository.save(miniroom);
    }

    // 기존 데이터 삭제
    await this.MinimiRepository.delete({ miniroom: { id: miniroom.id } });
    await this.bubbleRepository.delete({ miniroom: { id: miniroom.id } });

    const newMinimis: Minimi[] = [];
    const newBubbles: SpeechBubble[] = [];

    for (const item of items) {
      if (item.type === "speechBubble") {
        newBubbles.push(
          this.bubbleRepository.create({
            user: { id: userId },
            text: item.text || "",
            left: Math.round(item.left),
            top: Math.round(item.top),
            miniroom,
          })
        );
      } else if (item.type === "minimi") {
        const minimi = this.MinimiRepository.create({
          user: { id: userId },
          left: Math.round(item.left),
          top: Math.round(item.top),
          miniroom,
        });

        if (item.id !== "default-minimi") {
          const storeItem = await this.storeItemService.findItemById(
            Number(item.id)
          );
          if (!storeItem) continue;
          minimi.storeItem = storeItem;
        }

        newMinimis.push(minimi);
      }
    }

    await this.MinimiRepository.save(newMinimis);
    await this.bubbleRepository.save(newBubbles);
  }

  // 미니룸 조회
  async getMiniroomLayoutByUser(userId: number): Promise<
    {
      id: number;
      type: "minimi" | "speechBubble";
      left: number;
      top: number;
      text?: string;
    }[]
  > {
    const miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
      relations: ["minimis", "speechBubbles"],
    });

    if (!miniroom) return [];
    const minimis = miniroom.minimis.map((minimi) => ({
      id: minimi.storeItem.id,
      type: "minimi" as const,
      left: minimi.left,
      top: minimi.top,
    }));

    const bubbles = miniroom.speechBubbles.map((bubble) => ({
      id: bubble.id,
      type: "speechBubble" as const,
      left: bubble.left,
      top: bubble.top,
      text: bubble.text,
    }));

    return [...minimis, ...bubbles];
  }

  // 미니룸 배경 저장
  async updateMiniroomBackground(
    userId: number,
    storeItemId: number | "default-miniroom"
  ): Promise<void> {
    const miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
      relations: ["storeItem"],
    });

    if (!miniroom) {
      throw new NotFoundException("미니룸이 존재하지 않습니다.");
    }

    // 기본 배경으로 설정할 경우 null 저장
    if (storeItemId === "default-miniroom") {
      miniroom.storeItem = null;
    } else {
      const storeItem = await this.storeItemService.findItemById(
        Number(storeItemId)
      );
      if (!storeItem) {
        throw new NotFoundException("해당 아이템이 존재하지 않습니다.");
      }
      miniroom.storeItem = storeItem;
    }

    await this.miniRoomRepository.save(miniroom);
  }
}
