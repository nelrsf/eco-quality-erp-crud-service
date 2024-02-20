import { CreateColumnDto } from "../dto/create-column.dto";

export enum ColumnTypes {
    string = 'string',
    number = 'number',
    date = 'date',
    boolean = 'boolean',
    image = 'image',
    file = 'file',
    list = 'list'
}
export class Column extends CreateColumnDto{
    permissions: {
        read: Array<string>,
        edit: Array<string>,
        delete: Array<string>,
    }
}
