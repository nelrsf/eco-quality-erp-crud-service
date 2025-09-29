import { IColumnsOverrideData } from "src/eqmodules/columns/dto/create-column.dto";
import { Column } from "src/eqmodules/columns/entities/column.entity";
import { Table } from "src/eqmodules/tables/entities/table.entity";


export function grantAllPermissions(columns: any, isOwner: boolean, isAdmin: boolean) {

    const allPermissions = {
        delete: [],
        edit: [],
        read: [],
        userAccess: {
            delete: true,
            read: true,
            edit: true
        }
    }

    Object.keys(columns).forEach(
        (columnId: string) => {
            const col: Column = columns[columnId];
            if (!col.permissions) {
                col.permissions = allPermissions;
            }
            col.permissions.userAccess = {
                edit: true,
                delete: true,
                read: true
            }
            col.permissions.isAdmin = isAdmin;
            col.permissions.isOwner = isOwner;
            if (col.linkedTable) {
                col.linkedTable.columnsOverrideData.forEach(
                    (cod: IColumnsOverrideData) => {
                        cod.virtualColumnData.permissions = allPermissions;
                        cod.virtualColumnData.permissions.isAdmin = isAdmin;
                        cod.virtualColumnData.permissions.isOwner = isOwner;
                        if (cod?.virtualColumnData.linkedTable) {
                            let virtualCols = cod.virtualColumnData.linkedTable.columnsOverrideData.map(c => c.virtualColumnData);
                            virtualCols = grantAllPermissions(virtualCols, isOwner, isAdmin);
                            cod.virtualColumnData.linkedTable.columnsOverrideData.forEach(
                                (c) => {
                                    c.virtualColumnData = virtualCols.find(vc => vc._id === c.columnId);
                                }
                            )
                        }
                    }
                )
            }
        }
    );
    return columns;
}

export function grantAllTablesPermissions(tables: Array<Table>, isOwner: boolean, isAdmin: boolean) {
    Object.keys(tables).forEach(
        (tableId: string) => {
            if (!tables[tableId].permissions) {
                tables[tableId].permissions = {}
            }
            tables[tableId].permissions.userAccess = {
                edit: true,
                read: true
            }

            tables[tableId].permissions.isAdmin = isAdmin;
            tables[tableId].permissions.isOwner = isOwner;
        }
    );
    return tables;
}