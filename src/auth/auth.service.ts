import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RoleService } from '../role/role.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    await this.roleService.assignDefaultRoleToUser(user.id);
    return this.buildAuthResponse(user.id);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user.id);
  }

  async buildAuthResponse(userId: number) {
    const user = await this.usersService.findOne(userId);
    const roles = await this.roleService.getUserRoleCodes(userId);
    const permissions = await this.roleService.getUserPermissionCodes(userId);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions,
        createdAt: user.createdAt,
      },
    };
  }
}
