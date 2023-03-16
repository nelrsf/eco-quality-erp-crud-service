import { PartialType } from '@nestjs/mapped-types';
import { ColumnTypes } from '../entities/column.entity';
import { CreateColumnDto } from './create-column.dto';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
    _id: any
    fieldName: string
    type: ColumnTypes
    hidden: boolean
    required: boolean
    module: string
    table: string
}
