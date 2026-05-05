"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let UserService = class UserService {
    users = [
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
        return this.users;
    }
    findCurrentUser(userId) {
        return {
            userId,
        };
    }
    findOne(id) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return this.users[userIndex];
    }
    create(createUserDto) {
        const newUser = {
            id: (0, crypto_1.randomUUID)(),
            ...createUserDto,
        };
        this.users.push(newUser);
        return newUser;
    }
    update(updateUserDto, id) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateUserDto,
        };
        return this.users[userIndex];
    }
    delete(id) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return this.users.splice(userIndex, 1)[0];
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map