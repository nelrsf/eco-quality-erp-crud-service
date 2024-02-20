export function deleteUnauthorizedTables(bodyObject: Array<any>, profile: any) {
    const result: Array<any> = [];
    bodyObject.forEach(
        (table: any, index: number) => {
            if (table?.permissions?.read?.includes(profile?._id?.toString())) {
                result.push(table);
                if (table?.tables) {
                    table.tables = deleteUnauthorizedTables(table.tables, profile);
                }
            }
        }
    )

    return result;
}