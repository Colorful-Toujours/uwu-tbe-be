import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '8888@qq.com', description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;
}
