import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PERMISSION_CODES } from '../auth/constants/permissions';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(PERMISSION_CODES.USER_CREATE)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permissions(PERMISSION_CODES.USER_READ)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions(PERMISSION_CODES.USER_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Permissions(PERMISSION_CODES.USER_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Permissions(PERMISSION_CODES.USER_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
