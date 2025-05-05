import { Module } from "@nestjs/common";
import { VisitService } from "./visit.service";
import { VisitController } from "./visit.controller";
import { UsersModule } from "src/users/users.module";
import { Visit } from "./visit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), UsersModule],
  providers: [VisitService],
  controllers: [VisitController],
})
export class VisitModule {}
