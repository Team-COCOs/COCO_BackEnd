"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BgmModule = void 0;
const common_1 = require("@nestjs/common");
const bgm_service_1 = require("./bgm.service");
const bgm_controller_1 = require("./bgm.controller");
let BgmModule = class BgmModule {
};
exports.BgmModule = BgmModule;
exports.BgmModule = BgmModule = __decorate([
    (0, common_1.Module)({
        providers: [bgm_service_1.BgmService],
        controllers: [bgm_controller_1.BgmController]
    })
], BgmModule);
//# sourceMappingURL=bgm.module.js.map