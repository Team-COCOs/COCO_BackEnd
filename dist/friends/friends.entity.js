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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = exports.FriendStatus = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
var FriendStatus;
(function (FriendStatus) {
    FriendStatus["PENDING"] = "pending";
    FriendStatus["ACCEPTED"] = "accepted";
    FriendStatus["REJECTED"] = "rejected";
})(FriendStatus || (exports.FriendStatus = FriendStatus = {}));
let Friend = class Friend {
};
exports.Friend = Friend;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Friend.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "requester_id" }),
    __metadata("design:type", users_entity_1.User)
], Friend.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "accepter_id" }),
    __metadata("design:type", users_entity_1.User)
], Friend.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Friend.prototype, "requester_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Friend.prototype, "receiver_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: FriendStatus }),
    __metadata("design:type", String)
], Friend.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Friend.prototype, "created_at", void 0);
exports.Friend = Friend = __decorate([
    (0, typeorm_1.Entity)("friends")
], Friend);
//# sourceMappingURL=friends.entity.js.map