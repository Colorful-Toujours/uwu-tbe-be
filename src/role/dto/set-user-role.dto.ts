import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetUserRoleDto {
  @ApiProperty({ example: 2, description: '用户 id' })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    example: [1, 3],
    description: '角色 id 列表（覆盖式设置）',
    type: [Number],
  })
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  roleIds: number[];
}
