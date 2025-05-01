import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { StoreitemsService } from "./storeitems.service";
import { CreateStoreItemDto, UpdateStoreItemDto } from "./dto/storeitem.dto";
import { StoreItemType } from "./storeitems.entity";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../auth/guards/admin.guard";
@ApiTags("스토어 아이템")
@Controller("storeitems")
export class StoreitemsController {
  constructor(private readonly storeitemsService: StoreitemsService) {}

  @Get()
  @ApiOperation({ summary: "스토어 아이템 전체 또는 타입별 조회" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: StoreItemType,
    description: "아이템 타입 필터 (예: minimi, tapcolor 등)",
  })
  findAll(@Query("type") type?: StoreItemType) {
    return this.storeitemsService.findAll(type);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @ApiOperation({ summary: "스토어 아이템 등록 (관리자)" })
  create(@Body() dto: CreateStoreItemDto) {
    return this.storeitemsService.create(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @ApiOperation({ summary: "스토어 아이템 수정 (관리자)" })
  @ApiParam({ name: "id", type: Number })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateStoreItemDto
  ) {
    return this.storeitemsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @ApiOperation({ summary: "스토어 아이템 삭제 (관리자)" })
  @ApiParam({ name: "id", type: Number })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.storeitemsService.remove(id);
  }
}
