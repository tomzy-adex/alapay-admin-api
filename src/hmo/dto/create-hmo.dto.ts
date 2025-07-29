import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { Status } from 'src/utils/types';

export class CreateHmoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  //   @ApiProperty()
  //   @IsString()
  //   @IsOptional()
  //   verificationComments: string;
}

export class QueryHmoDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  hmoId: string;
}

export class UpdateHmoStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comments: string;
}
