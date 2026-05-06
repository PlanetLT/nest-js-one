"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ProfilesService = class ProfilesService {
    profiles = [
        {
            id: (0, crypto_1.randomUUID)(),
            name: 'John Doe',
            description: 'A sample profile',
        },
        {
            id: (0, crypto_1.randomUUID)(),
            name: 'John Doe two',
            description: 'A sample profile two',
        },
        {
            id: (0, crypto_1.randomUUID)(),
            name: 'John Doe three',
            description: 'A sample profile three',
        },
    ];
    findAll() {
        return this.profiles;
    }
    findCurrentUser(userId) {
        return {
            userId,
        };
    }
    findOne(id) {
        const profileIndex = this.profiles.findIndex((profile) => profile.id === id);
        if (profileIndex === -1) {
            throw new common_1.NotFoundException(`Profile with id ${id} not found`);
        }
        return this.profiles[profileIndex];
    }
    create(createProfileDto) {
        const newProfile = {
            id: (0, crypto_1.randomUUID)(),
            ...createProfileDto,
        };
        this.profiles.push(newProfile);
        return newProfile;
    }
    update(updateProfileDto, id) {
        const profileIndex = this.profiles.findIndex((profile) => profile.id === id);
        if (profileIndex === -1) {
            throw new common_1.NotFoundException(`Profile with id ${id} not found`);
        }
        this.profiles[profileIndex] = {
            ...this.profiles[profileIndex],
            ...updateProfileDto,
        };
        return this.profiles[profileIndex];
    }
    delete(id) {
        const profileIndex = this.profiles.findIndex((profile) => profile.id === id);
        if (profileIndex === -1) {
            throw new common_1.NotFoundException(`Profile with id ${id} not found`);
        }
        return this.profiles.splice(profileIndex, 1)[0];
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)()
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map