import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'editor',
    default: 'editor',
    description: '角色唯一标识',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({
    example: '编辑',
    default: '编辑',
    description: '角色名称',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: '可查看和修改用户',
    default: '可查看和修改用户',
    description: '角色描述',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
