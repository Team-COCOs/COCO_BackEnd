import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BGM } from "./bgm.entity";
import { CreateBgmDto } from "./dto/bgm.dto";

@Injectable()
export class BgmService {
  constructor(
    @InjectRepository(BGM)
    private readonly repo: Repository<BGM>
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(dto: CreateBgmDto) {
    const bgm = this.repo.create(dto);
    return this.repo.save(bgm);
  }

  async remove(id: number) {
    const bgm = await this.repo.findOne({ where: { id } });
    if (!bgm) throw new NotFoundException("BGM이 존재하지 않습니다.");
    return this.repo.remove(bgm);
  }
}
