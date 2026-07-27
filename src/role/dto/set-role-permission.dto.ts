import { ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetRolePermissionDto {
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  permissionIds: number[];
}
