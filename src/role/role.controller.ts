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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PERMISSION_CODES } from '../auth/constants/permissions';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetRolePermissionDto } from './dto/set-role-permission.dto';
import { SetUserRoleDto } from './dto/set-user-role.dto';

@ApiTags('角色')
@ApiBearerAuth('JWT')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '创建角色' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '角色列表' })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '给用户分配角色' })
  @Post('users/set')
  setUserRoles(@Body() setUserRoleDto: SetUserRoleDto) {
    return this.roleService.setUserRoles(setUserRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '查询用户角色' })
  @ApiParam({ name: 'userId', example: 2, description: '用户 id' })
  @Get('users/:userId')
  getUserRoles(@Param('userId', ParseIntPipe) userId: number) {
    return this.roleService.getUserRoles(userId);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '查询用户最终权限码' })
  @ApiParam({ name: 'userId', example: 2, description: '用户 id' })
  @Get('users/:userId/permissions')
  async getUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    const codes = await this.roleService.getUserPermissionCodes(userId);
    return { userId, permissions: codes };
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '角色详情（含权限）' })
  @ApiParam({ name: 'id', example: 3, description: '角色 id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '给角色分配权限（覆盖式）' })
  @ApiParam({ name: 'id', example: 3, description: '角色 id' })
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
  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', example: 3, description: '角色 id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Permissions(PERMISSION_CODES.ROLE_MANAGE)
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', example: 3, description: '角色 id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
