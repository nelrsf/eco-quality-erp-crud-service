import { Column } from "src/eqmodules/columns/entities/column.entity";

interface IColumnsOverrideData {
    columnId: string,
    hide: boolean,
    width?: number,
    order: number | undefined,
    isVirtualColumn: boolean,
    virtualColumnData: Column
}

export function modifyReadPermissions(columnsObj: any, profile: any) {
    Object.keys(columnsObj).forEach(
        (columnId: string) => {
            if (columnsObj[columnId]?.permissions?.read?.includes(profile?._id?.toString())) {
                columnsObj[columnId].permissions.read = [profile?._id?.toString()];
                const subtableColumns = columnsObj[columnId]?.linkedTable?.columnsOverrideData;
                if (subtableColumns) {
                    const columnsJson = converArray2Json(subtableColumns);
                    const filteredColumns = modifyReadPermissions(columnsJson, profile);
                    const columnsArray = converJson2Array(filteredColumns);
                    columnsObj[columnId].linkedTable.columnsOverrideData = clearUnauthorizedColumns(columnsObj[columnId].linkedTable.columnsOverrideData, columnsArray);
                }
            } else {
                delete columnsObj[columnId];
            }
        }
    );

    return columnsObj;

}

function clearUnauthorizedColumns(columnsOverride: Array<IColumnsOverrideData>, authorizedColumns: Array<Column>) {
    const newColumnsOverride = [];
    authorizedColumns.forEach(
        (ac: Column) => {
            const itemColumnOverride = columnsOverride.find((co: IColumnsOverrideData) => co.columnId === ac._id);
            if (itemColumnOverride) {
                newColumnsOverride.push(itemColumnOverride);
            }
        }
    );
    return newColumnsOverride;
}

function converArray2Json(array: Array<any>) {
    const newJson = {};
    array?.forEach(
        (item: any) => {
            newJson[item.columnId] = item?.virtualColumnData;
        }
    );
    return newJson;
}

function converJson2Array(json: any) {
    const newArray = [];
    Object.keys(json).forEach(
        (colId: string) => {
            newArray.push(json[colId]);
        }
    );
    return newArray;
}