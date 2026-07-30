import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'user:export',
    default: 'user:export',
    description: '权限唯一标识',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code: string;

  @ApiProperty({
    example: '导出用户',
    default: '导出用户',
    description: '权限名称',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: '导出用户数据',
    default: '导出用户数据',
    description: '权限描述',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
