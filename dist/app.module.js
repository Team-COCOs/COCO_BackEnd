"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const minihomepis_module_1 = require("./minihomepis/minihomepis.module");
const friends_module_1 = require("./friends/friends.module");
const posts_module_1 = require("./posts/posts.module");
const comments_module_1 = require("./comments/comments.module");
const photos_service_1 = require("./photos/photos.service");
const photos_controller_1 = require("./photos/photos.controller");
const guestbooks_module_1 = require("./guestbooks/guestbooks.module");
const notifications_module_1 = require("./notifications/notifications.module");
const storeitems_module_1 = require("./storeitems/storeitems.module");
const purchases_module_1 = require("./purchases/purchases.module");
const gifts_module_1 = require("./gifts/gifts.module");
const chatbotmessages_module_1 = require("./chatbotmessages/chatbotmessages.module");
const bgm_module_1 = require("./bgm/bgm.module");
const minimiitems_module_1 = require("./minimiitems/minimiitems.module");
const miniroomitems_module_1 = require("./miniroomitems/miniroomitems.module");
const skin_module_1 = require("./skin/skin.module");
const useritems_module_1 = require("./useritems/useritems.module");
const payments_module_1 = require("./payments/payments.module");
const photos_module_1 = require("./photos/photos.module");
const diary_module_1 = require("./diary/diary.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: "mysql",
                    host: config.get("DB_HOST"),
                    port: parseInt(config.get("DB_PORT"), 10),
                    username: config.get("DB_USER"),
                    password: config.get("DB_PASSWORD"),
                    database: config.get("DB_NAME"),
                    entities: [],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            minihomepis_module_1.MinihomepisModule,
            friends_module_1.FriendsModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            guestbooks_module_1.GuestbooksModule,
            notifications_module_1.NotificationsModule,
            storeitems_module_1.StoreitemsModule,
            purchases_module_1.PurchasesModule,
            gifts_module_1.GiftsModule,
            chatbotmessages_module_1.ChatbotmessagesModule,
            bgm_module_1.BgmModule,
            minimiitems_module_1.MinimiitemsModule,
            miniroomitems_module_1.MiniroomitemsModule,
            skin_module_1.SkinModule,
            useritems_module_1.UseritemsModule,
            payments_module_1.PaymentsModule,
            photos_module_1.PhotosModule,
            diary_module_1.DiaryModule,
            auth_module_1.AuthModule,
        ],
        controllers: [photos_controller_1.PhotosController],
        providers: [photos_service_1.PhotosService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map