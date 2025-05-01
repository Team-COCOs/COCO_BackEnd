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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { StoreitemsService } from "./storeitems.service";
import { CreateStoreItemDto, UpdateStoreItemDto } from "./dto/storeitem.dto";
import { StoreItemType } from "./storeitems.entity";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../auth/guards/admin.guard";
import { FileInterceptor } from "@nestjs/platform-express";

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
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "스토어 아이템 등록 (관리자)" })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateStoreItemDto
  ) {
    const categoryMap: Record<string, StoreItemType> = {
      "미니홈피 배경": StoreItemType.MINIHOMEPIS,
      "다이어리 배경": StoreItemType.DIARY_BG,
      탭: StoreItemType.TAPCOLOR,
      미니룸: StoreItemType.MINIROOM,
      미니미: StoreItemType.MINIMI,
      노래: StoreItemType.BGM,
    };
    const mappedCategory = categoryMap[dto.category];
    if (!mappedCategory) {
      throw new Error("유효하지 않은 category입니다.");
    }

    const imageUrl = `https://your-cdn.com/${file.filename}`;

    return this.storeitemsService.create({
      ...dto,
      category: mappedCategory,
      file: imageUrl,
    });
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
