import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserRoles } from '../utils/types';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(payload: CreateRoleDto) {
    try {
      const role = this.roleRepository;

      const { permission } = payload;

      if (!role) throw new BadRequestException('Role model is not loaded.');

      const roleExist = await role.findOneBy({ permission });

      if (roleExist)
        throw new BadRequestException(`${permission} role already exist.`);

      const newRole = await role.save({ ...payload });

      return {
        success: true,
        message: `${permission} role created successfully`,
        data: newRole,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoles() {
    try {
      const roles = await this.roleRepository.find();

      if (!roles) throw new NotFoundException('Role not found.');

      return {
        success: true,
        message: 'Roles fetched successfully',
        data: roles,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: string) {
    try {
      const role = await this.roleRepository.findOneBy({ id });

      if (!role) throw new NotFoundException('Role not found.');

      return {
        success: true,
        message: 'Role fetched successfully',
        data: role,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoleByPermission(permission: UserRoles) {
    try {
      const role = await this.roleRepository.findOneBy({ permission });

      if (!role) return null;

      return {
        success: true,
        message: 'Role fetched successfully',
        data: role,
      };
    } catch (error) {
      throw error;
    }
  }
}
