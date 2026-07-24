import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: 'user' })
  role: string;

  @ManyToMany(() => Permission, (permission) => permission.users)
  @JoinTable({ name: 'user_permissions' })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
