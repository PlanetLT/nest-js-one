import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users = [
    {
      id: randomUUID(),
      name: 'John Doe',
      description: 'A sample profile',
    },
    {
      id: randomUUID(),
      name: 'John Doe two',
      description: 'A sample profile two',
    },
    {
      id: randomUUID(),
      name: 'John Doe three',
      description: 'A sample profile three',
    },
  ];

  findAll() {
    return this.users;
  }

  findCurrentUser(userId: string) {
    return {
      userId,
    };
  }

  findOne(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.users[userIndex];
  }

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: randomUUID(),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(updateUserDto: UpdateUserDto, id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };
    return this.users[userIndex];
  }

  delete(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.users.splice(userIndex, 1)[0];
  }
}
