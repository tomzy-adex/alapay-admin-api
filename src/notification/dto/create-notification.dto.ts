import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProcessStatus } from 'src/utils/types';

export class CreateNotificationDto {
  @ApiProperty({ enumName: 'Status', enum: ProcessStatus })
  @IsEnum(ProcessStatus)
  @IsNotEmpty()
  status: ProcessStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
