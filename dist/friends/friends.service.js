"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const friends_entity_1 = require("./friends.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const users_service_1 = require("../users/users.service");
let FriendsService = class FriendsService {
    constructor(friendsRepository, usersService, notificationsService) {
        this.friendsRepository = friendsRepository;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
    }
    async request(requesterId, receiverId, requester_name, receiver_name) {
        if (requesterId === receiverId)
            throw new common_1.BadRequestException("자기 자신에게 신청할 수 없습니다.");
        const existing = await this.friendsRepository.findOne({
            where: [
                { requester: { id: requesterId }, receiver: { id: receiverId } },
                { requester: { id: receiverId }, receiver: { id: requesterId } },
            ],
        });
        if (existing)
            throw new common_1.ConflictException("이미 요청되었거나 일촌입니다.");
        const request = this.friendsRepository.create({
            requester: { id: requesterId },
            receiver: { id: receiverId },
            requester_name,
            receiver_name,
            status: friends_entity_1.FriendStatus.PENDING,
        });
        await this.friendsRepository.save(request);
        const requester = await this.usersService.findUserById(requesterId);
        await this.notificationsService.create(receiverId, `${requester?.name || "누군가"}님이 일촌 신청을 보냈습니다.`, requesterId);
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friends_entity_1.Friend)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map