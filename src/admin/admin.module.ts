import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { UsersModule } from "../users/users.module";
import { PaymentsModule } from "../payments/payments.module";
import { PhotosModule } from "src/photos/photos.module";
import { DiaryModule } from "src/diary/diary.module";

@Module({
  imports: [UsersModule, PaymentsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
