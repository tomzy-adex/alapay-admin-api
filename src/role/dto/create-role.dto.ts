import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoles } from '../../utils/types';

export class CreateRoleDto {
  @ApiProperty({ enumName: 'UserRoles', enum: UserRoles })
  @IsEnum(UserRoles)
  @IsNotEmpty()
  permission: UserRoles;
}
