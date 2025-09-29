import { Column } from "src/eqmodules/columns/entities/column.entity";
import { Connection } from "src/server/mongodb/connection";

export async function addColumnRestriciton(column: Column) {
    if (!column) {
        return;
    }
    if (column.linkedTable) {
        const promises = column.linkedTable.columnsOverrideData.map(
            async (cov) => {
                if(!cov.isVirtualColumn){
                    cov.virtualColumnData.isRestricted = true;
                    cov.virtualColumnData.moduleRestriction = column.linkedTable.module;
                    cov.virtualColumnData.tableRestriction = column.linkedTable.table;
                    cov.virtualColumnData.columnRestriction = cov.columnId;
                    await addColumnRestriciton(cov.virtualColumnData);
                }
            }
        );
        await Promise.all(promises)
    }
    if (!column.isRestricted) {
        return;
    }
    const client = Connection.getClient();
    const moduleRestriction = client.db(column.moduleRestriction);
    const tableRestriction = moduleRestriction.collection(column.tableRestriction);
    const restrictions = await tableRestriction.find().toArray();
    // column.restrictions = restrictions;
    await addRestrictedColumn(restrictions, column);
}

async function addRestrictedColumn(restrictions: Array<any>, column: Column) {
    if (!restrictions || restrictions.length <= 0) {
        return;
    }
    const docummentMetadata = restrictions.find(
        (doc) => {
            return doc.name__document_md = "document-metadata";
        }
    );

    if (!docummentMetadata) {
        return;
    }

    const restrictedColumn = docummentMetadata[column.columnRestriction];
    column.restrictedColumn = restrictedColumn;
    if (column.linkedTable) {
        const promises = column.linkedTable.columnsOverrideData.map(
            async (cov) => {
                await addColumnRestriciton(cov.virtualColumnData);
            }
        );
        await Promise.all(promises)
    }

}