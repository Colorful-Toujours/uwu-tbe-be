import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RoleService } from '../role/role.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async me(@CurrentUser() user: User) {
    const roles = await this.roleService.getUserRoleCodes(user.id);
    const permissions = await this.roleService.getUserPermissionCodes(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
      permissions,
      createdAt: user.createdAt,
    };
  }
}
