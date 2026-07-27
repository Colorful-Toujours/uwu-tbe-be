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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
