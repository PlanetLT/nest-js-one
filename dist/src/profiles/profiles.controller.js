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
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const create_profile_dto_1 = require("./dto/create-profile.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const profiles_service_1 = require("./profiles.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const profiles_guard_1 = require("./profiles.guard");
const skip_rate_limit_decorator_1 = require("../rate-limit/skip-rate-limit.decorator");
let ProfilesController = class ProfilesController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    findAll() {
        return this.profileService.findAll();
    }
    findCurrentUser(req) {
        return this.profileService.findCurrentUser(req.user.userId);
    }
    findOne(id) {
        return this.profileService.findOne(id);
    }
    create(createProfileDto) {
        return this.profileService.create(createProfileDto);
    }
    update(updateProfileDto, id) {
        return this.profileService.update(updateProfileDto, id);
    }
    remove(id) {
        return this.profileService.delete(id);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Get)(),
    (0, skip_rate_limit_decorator_1.SkipRateLimit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "findCurrentUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_profile_dto_1.CreateProfileDto]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "remove", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, common_1.Controller)('profiles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, profiles_guard_1.ProfilesGuard),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map