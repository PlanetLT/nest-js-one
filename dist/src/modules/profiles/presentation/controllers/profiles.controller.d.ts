import type { AuthenticatedRequest } from '../../../../shared/types/authenticated-request.type';
import { CreateProfileDto } from '../../application/dto/create-profile.dto';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { ProfilesService } from '../../infrastructure/services/profiles.service';
export declare class ProfilesController {
    private profileService;
    constructor(profileService: ProfilesService);
    findAll(): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        description: string;
    }[];
    findCurrentUser(req: AuthenticatedRequest): {
        userId: string;
    };
    findOne(id: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        description: string;
    };
    create(createProfileDto: CreateProfileDto): {
        name: string;
        description: string;
        id: `${string}-${string}-${string}-${string}-${string}`;
    };
    update(updateProfileDto: UpdateProfileDto, id: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        description: string;
    };
    remove(id: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        description: string;
    };
}
