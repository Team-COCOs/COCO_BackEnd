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
exports.Guestbook = exports.VisibilityStatus = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
var VisibilityStatus;
(function (VisibilityStatus) {
    VisibilityStatus["PRIVATE"] = "private";
    VisibilityStatus["PUBLIC"] = "public";
})(VisibilityStatus || (exports.VisibilityStatus = VisibilityStatus = {}));
let Guestbook = class Guestbook {
};
exports.Guestbook = Guestbook;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Guestbook.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "host_id" }),
    __metadata("design:type", users_entity_1.User)
], Guestbook.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "guest_id" }),
    __metadata("design:type", users_entity_1.User)
], Guestbook.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Guestbook.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: VisibilityStatus,
        default: VisibilityStatus.PUBLIC,
    }),
    __metadata("design:type", String)
], Guestbook.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Guestbook.prototype, "created_at", void 0);
exports.Guestbook = Guestbook = __decorate([
    (0, typeorm_1.Entity)("guestbooks")
], Guestbook);
//# sourceMappingURL=guestbooks.entity.js.map