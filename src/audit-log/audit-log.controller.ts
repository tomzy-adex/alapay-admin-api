import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { QueryDto } from 'src/config/dto/query.dto';

@ApiBearerAuth('JWT')
@ApiTags('Audit Trail')
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @UseGuards(AdminGuard)
  @Get('log')
  async getLogbyId(@Query() logId: string) {
    return await this.auditLogService.getLogbyId(logId);
  }

  @UseGuards(AdminGuard)
  @Get('logs')
  async getLogs(@Query() query: QueryDto) {
    return await this.auditLogService.getLogs(query);
  }
}
