import { Table } from "src/eqmodules/tables/entities/table.entity";

export function getTableEmptyPermissions(table: Table) {
    if (table.permissions) {
        table.permissions.userAccess = {
            edit: false,
            read: false,
            delete: false
        }
    } else {
        table.permissions = {
            userAccess: {
                edit: false,
                read: false,
                delete: false
            },
            edit: [],
            read: []
        }
    }
    return table;
}