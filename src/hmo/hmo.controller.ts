import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-log/audit-interceptor.service';
import { AccountApprovalDto } from 'src/user/dto/update-user.dto';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { HmoService } from './hmo.service';
import { AuditLog } from 'src/utils/decorators/audit-log.decorator';
import { UpdateHmoDto } from './dto/update-hmo.dto';
import { QueryDto } from 'src/config/dto/query.dto';

@ApiBearerAuth('JWT')
@ApiTags('HMO')
@UseInterceptors(AuditInterceptor)
@UseGuards(AdminGuard)
@Controller('hmo')
export class HmoController {
  constructor(private readonly hmoService: HmoService) {}

  @Put('verify-account')
  @AuditLog('Put', 'HMO')
  async verifyHmoAccount(
    @Query('hmoId') hmoId: string,
    @Body() payload: AccountApprovalDto,
  ) {
    return await this.hmoService.verifyHmoAccount(hmoId, payload);
  }

  @Put('update-hmo')
  @AuditLog('Put', 'HMO')
  async updateHmoProfile(
    @Query('hmoId') hmoId: string,
    @Body() payload: UpdateHmoDto,
  ) {
    return await this.hmoService.updateHmoProfile(hmoId, payload);
  }

  @Get('account')
  @AuditLog('Get', 'HMO')
  async getHmoById(@Query('hmoId') hmoId: string) {
    return await this.hmoService.getHmoById(hmoId);
  }

  @Get('accounts')
  @AuditLog('Get', 'HMO')
  async getHmos(@Query() query: QueryDto) {
    return await this.hmoService.getHmos(query);
  }
}
