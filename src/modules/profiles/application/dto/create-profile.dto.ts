import { IsString, Length } from 'class-validator';
export class CreateProfileDto {
  @IsString()
  @Length(3, 50)
  name: string;
  @IsString()
  description: string;
}
