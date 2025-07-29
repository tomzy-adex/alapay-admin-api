import { PartialType } from '@nestjs/mapped-types';
import { CreateHmoDto } from './create-hmo.dto';

export class UpdateHmoDto extends PartialType(CreateHmoDto) {}
