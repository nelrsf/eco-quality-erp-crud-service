import { PartialType } from '@nestjs/mapped-types';
import { CreateRowDto } from './create-row.dto';

export class UpdateRowDto extends PartialType(CreateRowDto) {}
