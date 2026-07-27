import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetUserRoleDto } from './dto/set-user-role.dto';
import {
  PERMISSION_DEFINITIONS,
  ROLE_CODES,
} from '../auth/constants/permissions';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRbac();
  }

  private async seedRbac(): Promise<void> {
    for (const definition of PERMISSION_DEFINITIONS) {
      const existing = await this.permissionRepository.findOne({
        where: { code: definition.code },
      });
      if (!existing) {
        await this.permissionRepository.save(
          this.permissionRepository.create(definition),
        );
      }
    }

    const allPermissions = await this.permissionRepository.find();
    const adminRole = await this.ensureRole(
      ROLE_CODES.ADMIN,
      '管理员',
      '拥有全部权限',
    );
    const userRole = await this.ensureRole(
      ROLE_CODES.USER,
      '普通用户',
      '基础只读权限',
    );

    adminRole.permissions = allPermissions;
    await this.roleRepository.save(adminRole);

    const readPermission = allPermissions.find(
      (p) => p.code === 'user:read',
    );
    userRole.permissions = readPermission ? [readPermission] : [];
    await this.roleRepository.save(userRole);

    const bootstrapUser = await this.usersRepository.findOne({
      where: { id: 1 },
      relations: ['roles'],
    });
    if (bootstrapUser) {
      const hasAdmin = bootstrapUser.roles?.some(
        (role) => role.code === ROLE_CODES.ADMIN,
      );
      if (!hasAdmin) {
        bootstrapUser.roles = [...(bootstrapUser.roles ?? []), adminRole];
        await this.usersRepository.save(bootstrapUser);
      }
    }
  }

  private async ensureRole(
    code: string,
    name: string,
    description: string,
  ): Promise<Role> {
    let role = await this.roleRepository.findOne({ where: { code } });
    if (!role) {
      role = await this.roleRepository.save(
        this.roleRepository.create({ code, name, description }),
      );
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({
      where: { code: createRoleDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Role code "${createRoleDto.code}" already exists`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }

  async findByCode(code: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { code },
      relations: ['permissions'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existing = await this.roleRepository.findOne({
        where: { code: updateRoleDto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Role code "${updateRoleDto.code}" already exists`,
        );
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async setRolePermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role #${roleId} not found`);
    }

    if (permissionIds.length === 0) {
      role.permissions = [];
      await this.roleRepository.save(role);
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

    role.permissions = permissions;
    await this.roleRepository.save(role);
    return permissions;
  }

  async setUserRoles(setUserRoleDto: SetUserRoleDto): Promise<Role[]> {
    const { userId, roleIds } = setUserRoleDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    if (roleIds.length === 0) {
      user.roles = [];
      await this.usersRepository.save(user);
      return [];
    }

    const roles = await this.roleRepository.findBy({ id: In(roleIds) });

    if (roles.length !== roleIds.length) {
      const foundIds = new Set(roles.map((item) => item.id));
      const missingIds = roleIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Role ids not found: ${missingIds.join(', ')}`,
      );
    }

    user.roles = roles;
    await this.usersRepository.save(user);
    return roles;
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user.roles ?? [];
  }

  async assignDefaultRoleToUser(userId: number): Promise<void> {
    const userRole = await this.findByCode(ROLE_CODES.USER);
    if (!userRole) {
      return;
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      return;
    }

    const hasRoles = user.roles?.length > 0;
    if (hasRoles) {
      return;
    }

    user.roles = [userRole];
    await this.usersRepository.save(user);
  }

  async getUserPermissionCodes(userId: number): Promise<string[]> {
    const roles = await this.getUserRoles(userId);
    const codes = new Set<string>();

    for (const role of roles) {
      for (const permission of role.permissions ?? []) {
        codes.add(permission.code);
      }
    }

    return Array.from(codes);
  }

  async getUserRoleCodes(userId: number): Promise<string[]> {
    const roles = await this.getUserRoles(userId);
    return roles.map((role) => role.code);
  }

}
