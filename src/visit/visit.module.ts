import { forwardRef, Module } from "@nestjs/common";
import { VisitService } from "./visit.service";
import { VisitController } from "./visit.controller";
import { UsersModule } from "../users/users.module";
import { Visit } from "./visit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), forwardRef(() => UsersModule)],
  providers: [VisitService],
  controllers: [VisitController],
  exports: [VisitService],
})
export class VisitModule {}
