import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuditInterceptor } from 'src/audit-log/audit-interceptor.service';
import { AuditLog } from 'src/utils/decorators/audit-log.decorator';

@ApiTags('Role')
@UseInterceptors(AuditInterceptor)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create-role')
  @AuditLog('Post', 'Role')
  async createRole(@Body() payload: CreateRoleDto) {
    return await this.roleService.createRole(payload);
  }

  @Get('roles')
  @AuditLog('Get', 'Role')
  async getRoles() {
    return await this.roleService.getRoles();
  }

  @Get()
  @AuditLog('Get', 'Role')
  async getRoleById(@Query('roleId') roleId: string) {
    return await this.roleService.getRoleById(roleId);
  }
}
