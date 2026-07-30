import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '测试账号',
    default: '测试账号',
    description: '用户名',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: '8888@qq.com',
    default: '8888@qq.com',
    description: '邮箱',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    default: '123456',
    description: '密码，至少 6 位',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;
}
