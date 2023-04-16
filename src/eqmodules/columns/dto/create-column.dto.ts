import { ColumnTypes } from "../entities/column.entity"

export class CreateColumnDto {
    columnName: string
    type: ColumnTypes
    hidden: boolean
    required: boolean
    module: string
    table: string
    unique: boolean
    moduleRestriction?: string
    tableRestriction?: string
    columnRestriction?: string
}
