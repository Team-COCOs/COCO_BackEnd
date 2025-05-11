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

  // async createBubble(
  //   user: User,
  //   dto: CreateSpeechBubbleDto
  // ): Promise<SpeechBubble> {
  //   const miniroom = await this.miniRoomRepository.findOne({
  //     where: { user: { id: user.id } },
  //   });

  //   if (!miniroom) {
  //     throw new NotFoundException("미니룸이 존재하지 않습니다.");
  //   }

  //   const bubble = new SpeechBubble();
  //   bubble.user = user;
  //   bubble.text = dto.text;
  //   bubble.left = dto.left;
  //   bubble.top = dto.top;
  //   bubble.miniroom = miniroom;

  //   if (dto.storeItemId) {
  //     const storeItem = await this.storeItemService.findById(dto.storeItemId);
  //     if (!storeItem) {
  //       throw new NotFoundException("해당 스토어 아이템이 존재하지 않습니다.");
  //     }
  //     bubble.storeItem = storeItem;
  //   }

  //   return this.bubbleRepository.save(bubble);
  // }
}
