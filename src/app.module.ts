import { Module } from "@nestjs/common";
// typeorm
import { TypeOrmModule } from "@nestjs/typeorm";
// config
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { MinihomepisModule } from "./minihomepis/minihomepis.module";
import { FriendsModule } from "./friends/friends.module";
import { DiaryCommentsModule } from "./diary_comments/diary_comments.module";
import { GuestbooksModule } from "./guestbooks/guestbooks.module";
import { StoreitemsModule } from "./storeitems/storeitems.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { ChatbotmessagesModule } from "./chatbotmessages/chatbotmessages.module";
import { BgmModule } from "./bgm/bgm.module";
import { UseritemsModule } from "./useritems/useritems.module";
import { PaymentsModule } from "./payments/payments.module";
import { PhotosModule } from "./photos/photos.module";
import { DiaryModule } from "./diary/diary.module";
import { AuthModule } from "./auth/auth.module";
import { User } from "./users/users.entity";
import { BGM } from "./bgm/bgm.entity";
import { Payment } from "./payments/payments.entity";
import { Photo } from "./photos/photos.entity";
import { Friend } from "./friends/friends.entity";
import { ChatbotMessage } from "./chatbotmessages/chatbotmessages.entity";
import { Diary } from "./diary/diary.entity";
import { PhotosCommentsModule } from "./photos_comments/photos_comments.module";
import { StoreItems } from "./storeitems/storeitems.entity";
import { Minihomepi } from "./minihomepis/minihomepis.entity";
import { DiaryComment } from "./diary_comments/diary_comments.entity";
import { VisitModule } from "./visit/visit.module";
import { Visit } from "./visit/visit.entity";
import { FriendCommentsModule } from "./friend_comments/friend_comments.module";
import { UserItem } from "./useritems/useritems.entity";
import { Purchase } from "./purchases/purchases.entity";
import { FriendComment } from "./friend_comments/friend_comments.entity";
import { PhotoComment } from "./photos_comments/photos_comments.entity";
import { PhotoFolder } from "./photos/photoFolder.entity";
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
        entities: [
          User,
          BGM,
          Photo,
          PhotoFolder,
          Payment,
          Friend,
          ChatbotMessage,
          Diary,
          StoreItems,
          Minihomepi,
          DiaryComment,
          Visit,
          UserItem,
          Purchase,
          FriendComment,
          PhotoComment,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    MinihomepisModule,
    FriendsModule,
    DiaryCommentsModule,
    GuestbooksModule,
    StoreitemsModule,
    PurchasesModule,
    ChatbotmessagesModule,
    BgmModule,
    UseritemsModule,
    PaymentsModule,
    PhotosModule,
    DiaryModule,
    AuthModule,
    PhotosCommentsModule,
    VisitModule,
    FriendCommentsModule,
    MinihomepisModule,
  ],
})
export class AppModule {}
