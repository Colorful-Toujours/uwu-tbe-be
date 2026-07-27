import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PERMISSION_CODES } from '../auth/constants/permissions';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetRolePermissionDto } from './dto/set-role-permission.dto';
import { SetUserRoleDto } from './dto/set-user-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Post('users/set')
  setUserRoles(@Body() setUserRoleDto: SetUserRoleDto) {
    return this.roleService.setUserRoles(setUserRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Get('users/:userId')
  getUserRoles(@Param('userId', ParseIntPipe) userId: number) {
    return this.roleService.getUserRoles(userId);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Get('users/:userId/permissions')
  async getUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    const codes = await this.roleService.getUserPermissionCodes(userId);
    return { userId, permissions: codes };
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Post(':id/permissions')
  setRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() setRolePermissionDto: SetRolePermissionDto,
  ) {
    return this.roleService.setRolePermissions(
      id,
      setRolePermissionDto.permissionIds,
    );
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
