import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserPermissionDto {
  @Type(() => Number)
  @IsInt()
  userId: number;
}
