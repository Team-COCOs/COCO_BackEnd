import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { VisitService } from "./visit.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("visit")
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  // 로그인 유저
  @Post("auth")
  @UseGuards(AuthGuard("jwt"))
  async visitAuth(@Body("hostId") hostId: number, @Req() req: any) {
    const visitorId = req.user.id;
    return this.visitService.visit(hostId, visitorId);
  }

  // 로그아웃 유저
  @Post("guest")
  async visitGuest(@Body("hostId") hostId: number) {
    return this.visitService.visit(hostId, null);
  }
}
