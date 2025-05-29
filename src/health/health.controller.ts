import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getStatus(@Res() res: Response) {
    const status = this.healthService.getStatus();

    if (status.ok) {
      return res.status(200).json(status);
    } else {
      return res.status(503).json(status);
    }
  }
}
