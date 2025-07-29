import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateSuperadminDto, CreateUserDto } from './dto/create-user.dto';
import { OnboardAccountDto } from './dto/onboard-user.dto';
import { AdminGuard } from '../utils/guards/admin.guard';
import { UpdateAdminDto } from 'src/auth/dto/admin-login.dto';
import { AccountApprovalDto } from './dto/update-user.dto';
import { QueryDto } from 'src/config/dto/query.dto';
import { AuditLog } from '../utils/decorators/audit-log.decorator';
import { AuditInterceptor } from 'src/audit-log/audit-interceptor.service';
import { GetAuthData } from 'src/utils/decorators/auth.decorator';
import { AuthData } from 'src/utils/auth.strategy';
import { CreateHmoDto } from 'src/hmo/dto/create-hmo.dto';

@ApiBearerAuth('JWT')
@ApiTags('Alapay Admin')
@UseInterceptors(AuditInterceptor)
@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get('user')
  @AuditLog('Get', 'User')
  async getAdminById(@Query('adminId') id: string) {
    return await this.userService.getAdminById(id);
  }

  @UseGuards(AdminGuard)
  @Get('users/role')
  @AuditLog('Get', 'User')
  async getAdminsbyRoleId(
    @Query('roleId') roleId: string,
    @Query() query: QueryDto,
  ) {
    return await this.userService.getAdminsbyRoleId(roleId, query);
  }

  @UseGuards(AdminGuard)
  @Get('users')
  @AuditLog('Get', 'User')
  async getAdmins(@Query() query: QueryDto) {
    return await this.userService.getAdmins(query);
  }

  @UseGuards(AdminGuard)
  @Put('update-profile')
  @AuditLog('Put', 'User')
  async updateAdminProfile(
    @Query('userId') userId: string,
    payload: UpdateAdminDto,
  ) {
    return await this.userService.updateAdminProfile(userId, payload);
  }

  @Post('GciOiJIUzI1NiIsInR5cCI6Ik/superadmin')
  @AuditLog('Post', 'User')
  async createSuperadmin(@Body() payload: CreateSuperadminDto) {
    return await this.userService.createSuperadmin(payload);
  }

  @UseGuards(AdminGuard)
  @Post('send-onboarding-link')
  @AuditLog('Post', 'User')
  async onboardAccount(
    @Body() payload: OnboardAccountDto,
    @GetAuthData() authData: AuthData,
  ) {
    return await this.userService.onboardAccount(payload, authData);
  }

  @UseGuards(AdminGuard)
  @Post(':roleId/onboard-hmo-admin-account')
  @AuditLog('Post', 'User')
  async registerHmoAdmin(
    @Param('roleId') roleId: string,
    @Query('token') token: string,
    @Body() payload: CreateUserDto,
  ) {
    return await this.userService.registerHmoAdmin(roleId, token, payload);
  }

  @UseGuards(AdminGuard)
  @Post(':roleId/onboard-hmo-account')
  @AuditLog('Post', 'User')
  async registerHmo(
    @Param('roleId') roleId: string,
    @Query('token') token: string,
    @Body() payload: CreateHmoDto,
  ) {
    return await this.userService.registerHmo(roleId, token, payload);
  }

  @UseGuards(AdminGuard)
  @Put('link-account')
  @AuditLog('Put', 'User')
  async linkAdminAccountToHmo(
    @Query('adminId') adminId: string,
    @Query('hmoId') hmoId: string,
  ) {
    return await this.userService.linkAdminAccountToHmo(adminId, hmoId);
  }

  @UseGuards(AdminGuard)
  @Post('verify-user')
  @AuditLog('Post', 'User')
  async accountApproval(
    @Query('accountId') accountId: string,
    @Body() payload: AccountApprovalDto,
  ) {
    return await this.userService.accountApproval(accountId, payload);
  }

  @Put('verify-account')
  @AuditLog('Put', 'User')
  async verifyUser(@Query('code') code: string) {
    return await this.userService.verifyUser(code);
  }
}
