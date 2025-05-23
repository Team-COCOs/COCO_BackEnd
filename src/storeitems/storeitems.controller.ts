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
  NotFoundException,
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
import { diskStorage } from "multer";
import { extname } from "path";
import * as dotenv from "dotenv";
dotenv.config();
@ApiTags("스토어 아이템")
@Controller("storeitems")
export class StoreitemsController {
  constructor(private readonly storeitemsService: StoreitemsService) {}

  @Get()
  @ApiOperation({ summary: "스토어 아이템 전체 또는 타입별 조회" })
  @ApiQuery({
    name: "category",
    required: false,
    enum: StoreItemType,
    description: "아이템 타입 필터 (예: minimi, tapcolor 등)",
  })
  async findAll(@Query("category") category?: StoreItemType) {
    const items = await this.storeitemsService.findItems(category);

    return items.map((item) => {
      if (item.category === StoreItemType.BGM) {
        const previewUrl = item.file.replace(".mp3", "_preview.mp3");
        return {
          ...item,
          preview_url: previewUrl,
          full_url: item.file,
          file: undefined,
        };
      }

      return item;
    });
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @UseInterceptors(
    FileInterceptor("storeItem", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
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
      throw new NotFoundException("유효하지 않은 category입니다.");
    }

    const serverHost = process.env.SERVER_HOST;

    const imageUrl = `${serverHost}/uploads/${file.filename}`;

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
