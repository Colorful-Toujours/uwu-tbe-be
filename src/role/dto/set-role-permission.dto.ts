import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetRolePermissionDto {
  @ApiProperty({
    example: [1, 3],
    default: [1, 3],
    description: '权限 id 列表（覆盖式设置）',
    type: [Number],
  })
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  permissionIds: number[];
}
