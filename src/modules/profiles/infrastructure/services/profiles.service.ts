import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProfileDto } from '../../application/dto/create-profile.dto';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private profiles = [
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
    return this.profiles;
  }

  findCurrentUser(userId: string) {
    return {
      userId,
    };
  }

  findOne(id: string) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return this.profiles[profileIndex];
  }

  create(createProfileDto: CreateProfileDto) {
    const newProfile = {
      id: randomUUID(),
      ...createProfileDto,
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  update(updateProfileDto: UpdateProfileDto, id: string) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updateProfileDto,
    };
    return this.profiles[profileIndex];
  }

  delete(id: string) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return this.profiles.splice(profileIndex, 1)[0];
  }
}
