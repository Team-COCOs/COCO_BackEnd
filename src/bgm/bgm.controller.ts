import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { BgmService } from "./bgm.service";
import { CreateBgmDto } from "./dto/bgm.dto";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("쥬크박스 (BGM)")
@Controller("bgm")
export class BgmController {
  constructor(private readonly bgmService: BgmService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @ApiOperation({ summary: "BGM 등록 (관리자)" })
  create(@Body() dto: CreateBgmDto) {
    return this.bgmService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "BGM 전체 조회" })
  findAll() {
    return this.bgmService.findAll();
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @ApiOperation({ summary: "BGM 삭제" })
  @ApiParam({ name: "id", type: Number })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.bgmService.remove(id);
  }
}
