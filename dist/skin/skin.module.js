"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinModule = void 0;
const common_1 = require("@nestjs/common");
const skin_service_1 = require("./skin.service");
const skin_controller_1 = require("./skin.controller");
let SkinModule = class SkinModule {
};
exports.SkinModule = SkinModule;
exports.SkinModule = SkinModule = __decorate([
    (0, common_1.Module)({
        providers: [skin_service_1.SkinService],
        controllers: [skin_controller_1.SkinController]
    })
], SkinModule);
//# sourceMappingURL=skin.module.js.map