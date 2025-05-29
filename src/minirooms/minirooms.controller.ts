import {
  Controller,
  UseGuards,
  Patch,
  Body,
  Req,
  Param,
  Get,
  Post,
} from "@nestjs/common";
import { MiniroomsService } from "./minirooms.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UseritemsService } from "src/useritems/useritems.service";
import { MiniroomTitleDto } from "./dto/title.dto";
import {
  GetMiniroomLayoutResDto,
  MinimiItemDto,
  SaveMiniroomLayoutDto,
  SpeechBubbleItemDto,
} from "./dto/minimi-layout.dto";
import { MiniroomBackgroundResDto } from "./dto/miniroom-BG.dto";
@ApiTags("미니룸")
@Controller("minirooms")
export class MiniroomsController {
  constructor(
    private readonly miniRoomService: MiniroomsService,
    private readonly userItemsService: UseritemsService
  ) {}

  // 미니룸 배경
  @Post("background")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸 배경(스킨) 설정" })
  @ApiBody({
    schema: {
      example: { purchaseId: "default-miniroom" },
    },
  })
  @ApiResponse({ status: 200, description: "미니룸 배경 저장 완료" })
  async saveBackground(
    @Body() body: { purchaseId: number | "default-miniroom" },
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    await this.userItemsService.setMiniRoomBack(userId, body.purchaseId);
    return { message: "미니룸 배경 저장 완료" };
  }

  // 미니룸 배경 조회
  @Get(":userId/background")
  @ApiOperation({ summary: "유저 ID로 미니룸 배경 조회" })
  @ApiParam({ name: "userId" })
  @ApiResponse({
    status: 200,
    type: MiniroomBackgroundResDto,
    description: "미니룸 배경 조회 성공",
  })
  async getMiniroomBackByUserId(@Param("userId") userId: number) {
    return await this.userItemsService.getUserMiniRoom(userId);
  }

  // 미니룸 이름 저장
  @Patch("title")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸 타이틀 저장" })
  @ApiBody({
    schema: {
      example: { name: "나의 아늑한 방" },
    },
  })
  @ApiResponse({ status: 200, description: "미니룸 이름 저장 완료" })
  async saveMiniroomName(@Body() body: { name: string }, @Req() req: Request) {
    const userId = req.user["id"];
    await this.miniRoomService.saveMiniroomName(userId, body.name);
    return { message: "미니룸 이름 저장 완료" };
  }

  // 미니룸 이름 조회
  @Get(":userId/title")
  @ApiOperation({ summary: "미니룸 타이틀 조회" })
  @ApiParam({ name: "userId" })
  @ApiResponse({
    status: 200,
    type: MiniroomTitleDto,
    description: "미니룸 타이틀 조회 성공",
  })
  async getMiniroomNameByUserId(@Param("userId") userId: number) {
    return await this.miniRoomService.getMiniroomName(userId);
  }

  // 미니미/말풍선 layout 저장
  @Post("save-layout")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니미/말풍선 배치 저장" })
  @ApiResponse({ status: 200, description: "미니미/말풍선 위치 저장 완료" })
  async saveLayout(@Body() body: SaveMiniroomLayoutDto, @Req() req: Request) {
    const userId = req.user["id"];
    console.log(" 미니룸 배치 오늘 값", body);
    await this.miniRoomService.saveMiniroomLayoutByUser(userId, body.items);
    return { message: "미니미/말풍선 위치 저장 완료" };
  }

  // 미니미/말풍선 조회
  @Get(":userId/layout")
  @ApiOperation({ summary: "미니룸 배치 조회 (미니미/말풍선)" })
  @ApiResponse({ status: 200, type: GetMiniroomLayoutResDto })
  @ApiExtraModels(MinimiItemDto, SpeechBubbleItemDto)
  async getMiniroomLayoutByUserId(@Param("userId") userId: number) {
    const items = await this.miniRoomService.getMiniroomLayoutByUser(userId);
    return { items };
  }
}
