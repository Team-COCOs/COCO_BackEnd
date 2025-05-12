import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SpeechBubble } from "./speechBubble.entity";
import { CreateSpeechBubbleDto } from "./dto/speech-bubbles.dto";
import { User } from "../users/users.entity";
import { MiniRoom } from "../minirooms/minirooms.entity";
import { StoreItems } from "../storeitems/storeitems.entity";
import { StoreitemsService } from "src/storeitems/storeitems.service";
import { Minimi } from "./minimi.entity";

@Injectable()
export class MiniroomsService {
  constructor(
    @InjectRepository(SpeechBubble)
    private readonly bubbleRepository: Repository<SpeechBubble>,
    @InjectRepository(MiniRoom)
    private readonly miniRoomRepository: Repository<MiniRoom>,
    @InjectRepository(Minimi)
    private readonly MinimiRepository: Repository<Minimi>,

    private readonly storeItemService: StoreitemsService
  ) {}

  // 미니룸 레이아웃 저장 (미니미, 말풍선)
  async saveMiniroomLayoutByUser(userId: number, items: any[]): Promise<void> {
    const miniroom = await this.miniRoomRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!miniroom) return;

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
      } else {
        const storeItem = await this.storeItemService.findItemById(item.id);
        if (!storeItem) continue;

        newMinimis.push(
          this.MinimiRepository.create({
            user: { id: userId },
            storeItem,
            left: Math.round(item.left),
            top: Math.round(item.top),
            miniroom,
          })
        );
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
}
