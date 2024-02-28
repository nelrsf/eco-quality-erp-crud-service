import { TableModes } from "../entities/table.entity"

export class CreateTableDto {
    module: string
    table: string
    route: string
    isFolder: boolean
    viewMode: TableModes

}
