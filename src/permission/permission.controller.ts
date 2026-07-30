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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@ApiTags('权限')
@ApiBearerAuth('JWT')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @ApiOperation({ summary: '创建权限' })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @ApiOperation({ summary: '权限列表' })
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @ApiOperation({ summary: '权限详情' })
  @ApiParam({ name: 'id', example: 1, description: '权限 id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @ApiOperation({ summary: '更新权限' })
  @ApiParam({ name: 'id', example: 1, description: '权限 id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @ApiOperation({ summary: '删除权限' })
  @ApiParam({ name: 'id', example: 1, description: '权限 id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
