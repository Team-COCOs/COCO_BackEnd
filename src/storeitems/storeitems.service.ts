import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoreItems, StoreItemType } from "./storeitems.entity";
import { Repository } from "typeorm";
import { CreateStoreItemDto, UpdateStoreItemDto } from "./dto/storeitem.dto";

import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class StoreitemsService {
  constructor(
    @InjectRepository(StoreItems)
    private readonly storeItemRepository: Repository<StoreItems>
  ) {}

  // 아이템 저장
  async create(dto: CreateStoreItemDto & { file: string }) {
    const item = this.storeItemRepository.create(dto);
    const saved = await this.storeItemRepository.save(item);
    const serverHost = process.env.SERVER_HOST;
    if (dto.category === StoreItemType.BGM) {
      const filePath = dto.file.replace(`${serverHost}`, ".");
      const previewPath = filePath.replace(".mp3", "_preview.mp3");

      const command = `ffmpeg -y -i ${filePath} -t 10 ${previewPath}`;
      await execAsync(command);
    }

    return saved;
  }

  // 수정
  async update(id: number, dto: UpdateStoreItemDto) {
    const item = await this.storeItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException("아이템이 존재하지 않습니다.");
    Object.assign(item, dto);
    return this.storeItemRepository.save(item);
  }

  // 삭제
  async remove(id: number) {
    const item = await this.storeItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException("아이템이 존재하지 않습니다.");
    return this.storeItemRepository.remove(item);
  }

  // 모든 아이템/카테고리별
  findItems(category?: StoreItemType) {
    if (category) {
      return this.storeItemRepository.find({ where: { category } });
    }
    return this.storeItemRepository.find();
  }

  // 아이디로 아이템 찾기
  async findItemById(id: number) {
    const item = await this.storeItemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException("스토어 아이템을 찾을 수 없습니다.");
    }

    return item;
  }
}
