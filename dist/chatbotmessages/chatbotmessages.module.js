"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotmessagesModule = void 0;
const common_1 = require("@nestjs/common");
const chatbotmessages_service_1 = require("./chatbotmessages.service");
const chatbotmessages_controller_1 = require("./chatbotmessages.controller");
let ChatbotmessagesModule = class ChatbotmessagesModule {
};
exports.ChatbotmessagesModule = ChatbotmessagesModule;
exports.ChatbotmessagesModule = ChatbotmessagesModule = __decorate([
    (0, common_1.Module)({
        providers: [chatbotmessages_service_1.ChatbotmessagesService],
        controllers: [chatbotmessages_controller_1.ChatbotmessagesController]
    })
], ChatbotmessagesModule);
//# sourceMappingURL=chatbotmessages.module.js.map