import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoreItems, StoreItemType } from "./storeitems.entity";
import { Repository } from "typeorm";
import { CreateStoreItemDto, UpdateStoreItemDto } from "./dto/storeitem.dto";

@Injectable()
export class StoreitemsService {
  constructor(
    @InjectRepository(StoreItems)
    private readonly storeItemRepository: Repository<StoreItems>
  ) {}

  findAll(category?: StoreItemType) {
    if (category) {
      return this.storeItemRepository.find({ where: { category } });
    }
    return this.storeItemRepository.find();
  }

  create(dto: CreateStoreItemDto) {
    const item = this.storeItemRepository.create(dto);
    return this.storeItemRepository.save(item);
  }

  async update(id: number, dto: UpdateStoreItemDto) {
    const item = await this.storeItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException("아이템이 존재하지 않습니다.");
    Object.assign(item, dto);
    return this.storeItemRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.storeItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException("아이템이 존재하지 않습니다.");
    return this.storeItemRepository.remove(item);
  }
}
