"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinihomepisModule = void 0;
const common_1 = require("@nestjs/common");
const minihomepis_service_1 = require("./minihomepis.service");
const minihomepis_controller_1 = require("./minihomepis.controller");
let MinihomepisModule = class MinihomepisModule {
};
exports.MinihomepisModule = MinihomepisModule;
exports.MinihomepisModule = MinihomepisModule = __decorate([
    (0, common_1.Module)({
        providers: [minihomepis_service_1.MinihomepisService],
        controllers: [minihomepis_controller_1.MinihomepisController]
    })
], MinihomepisModule);
//# sourceMappingURL=minihomepis.module.js.map