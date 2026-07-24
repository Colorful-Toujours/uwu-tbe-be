import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SetUserPermissionDto } from './dto/set-user-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Permission code "${createPermissionDto.code}" already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission #${id} not found`);
    }
    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== permission.code
    ) {
      const existing = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Permission code "${updatePermissionDto.code}" already exists`,
        );
      }
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  async setUserPermission(
    setUserPermissionDto: SetUserPermissionDto,
  ): Promise<Permission[]> {
    const { userId, permissionIds } = setUserPermissionDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    if (permissionIds.length === 0) {
      user.permissions = [];
      await this.usersRepository.save(user);
      return [];
    }

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    if (permissions.length !== permissionIds.length) {
      const foundIds = new Set(permissions.map((item) => item.id));
      const missingIds = permissionIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Permission ids not found: ${missingIds.join(', ')}`,
      );
    }

    user.permissions = permissions;
    await this.usersRepository.save(user);
    return permissions;
  }

  async getUserPermission(userId: number): Promise<Permission[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user.permissions ?? [];
  }
}
