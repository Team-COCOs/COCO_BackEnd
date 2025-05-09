import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { VisitService } from "./visit.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("visit")
export class VisitController {
  constructor(
    private readonly usersService: UsersService,
    private readonly visitService: VisitService
  ) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createVisit(@Body("hostId") hostId: number, @Req() req: any) {
    const visitorId = req.user.id;
    return this.visitService.visitOncePerDay(visitorId, hostId);
  }
}
