import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PERMISSION_CODES } from '../auth/constants/permissions';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(PERMISSION_CODES.USER_CREATE)
  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permissions(PERMISSION_CODES.USER_READ)
  @ApiOperation({ summary: '用户列表' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions(PERMISSION_CODES.USER_READ)
  @ApiOperation({ summary: '用户详情' })
  @ApiParam({ name: 'id', example: 1, description: '用户 id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Permissions(PERMISSION_CODES.USER_UPDATE)
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', example: 1, description: '用户 id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Permissions(PERMISSION_CODES.USER_DELETE)
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', example: 1, description: '用户 id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
