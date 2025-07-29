import {
  Body,
  Controller,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AdminLogindto,
  ResetPasswordDto,
  UpdateAdminDto,
} from './dto/admin-login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { AuditInterceptor } from 'src/audit-log/audit-interceptor.service';
import { AuditLog } from 'src/utils/decorators/audit-log.decorator';

@ApiTags('Sys Admins')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
@Controller('sysadmins')
export class AuthController {
  constructor(private readonly adminService: AuthService) {}

  @Post('login')
  @AuditLog('Post', 'User')
  async login(@Body() payload: AdminLogindto) {
    return await this.adminService.login(payload);
  }

  @UseGuards(AdminGuard)
  @Put('logout')
  @AuditLog('Put', 'User')
  async logout(@Query('token') token: string) {
    return await this.adminService.logout(token);
  }

  @Post('reset-password')
  @AuditLog('Post', 'User')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.adminService.resetPassword(payload);
  }

  @Put('change-password')
  @AuditLog('Post', 'User')
  async changePassword(@Body() payload: UpdateAdminDto) {
    return await this.adminService.changePassword(payload);
  }
}
