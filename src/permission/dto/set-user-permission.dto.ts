import { ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetUserPermissionDto {
  @Type(() => Number)
  @IsInt()
  userId: number;

  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  permissionIds: number[];
}
