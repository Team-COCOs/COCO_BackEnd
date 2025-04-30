import { Module } from "@nestjs/common";
// typeorm
import { TypeOrmModule } from "@nestjs/typeorm";
// config
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { MinihomepisModule } from "./minihomepis/minihomepis.module";
import { FriendsModule } from "./friends/friends.module";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { PhotosService } from "./photos/photos.service";
import { PhotosController } from "./photos/photos.controller";
import { GuestbooksModule } from "./guestbooks/guestbooks.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { StoreitemsModule } from "./storeitems/storeitems.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { GiftsModule } from "./gifts/gifts.module";
import { ChatbotmessagesModule } from "./chatbotmessages/chatbotmessages.module";
import { BgmModule } from "./bgm/bgm.module";
import { MinimiitemsModule } from "./minimiitems/minimiitems.module";
import { MiniroomitemsModule } from "./miniroomitems/miniroomitems.module";
import { SkinModule } from "./skin/skin.module";
import { UseritemsModule } from "./useritems/useritems.module";
import { PaymentsModule } from "./payments/payments.module";
import { PhotosModule } from "./photos/photos.module";
import { DiaryModule } from "./diary/diary.module";
import { AuthModule } from "./auth/auth.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST"),
        port: parseInt(config.get<string>("DB_PORT")!, 10),
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_NAME"),
        entities: [],
        synchronize: true,
      }),
    }),
    UsersModule,
    MinihomepisModule,
    FriendsModule,
    PostsModule,
    CommentsModule,
    GuestbooksModule,
    NotificationsModule,
    StoreitemsModule,
    PurchasesModule,
    GiftsModule,
    ChatbotmessagesModule,
    BgmModule,
    MinimiitemsModule,
    MiniroomitemsModule,
    SkinModule,
    UseritemsModule,
    PaymentsModule,
    PhotosModule,
    DiaryModule,
    AuthModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class AppModule {}
