import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { VisitService } from "./visit.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { VisitAuthDto, VisitResponseDto } from "./dto/visit.dto";
@ApiTags("방문")
@Controller("visit")
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  // 로그인 유저
  @Post("auth")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "방문 등록 (로그인 유저용)" })
  @ApiResponse({
    status: 200,
    description: "방문 성공 메시지",
    type: VisitResponseDto,
  })
  async visitAuth(@Body() body: VisitAuthDto, @Req() req: Request) {
    const visitorId = req.user["id"];
    return this.visitService.visit(body.hostId, visitorId);
  }
}
