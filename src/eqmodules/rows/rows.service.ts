import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Connection } from 'src/server/mongodb/connection';
import { ColumnsService } from '../columns/columns.service';
import { Column } from '../columns/entities/column.entity';

@Injectable()
export class RowsService {

  constructor(private columnsService: ColumnsService) { }


  async create(module: string, table: string, row: any, restrictions?: Array<any>) {
    const client = Connection.getClient();
    const rowCreated = await client.db(module).collection(table).insertOne(row);
    restrictions.forEach(
      (res: any) => { res.rowId = rowCreated.insertedId.toString() }
    )
    if (restrictions) {
      await this.updateRestrictions(module, table, restrictions);
      row = this.insertRestrictionsValues(row, restrictions, module, table);
    }
    return row;
  }

  private async insertRestrictionsValues(row: any, restrictions: Array<any>, module: string, table: string) {
    const columns = await this.columnsService.findAll(table, module);
    const columnsNames = Object.keys(columns);

    const columnPromises = columnsNames.map(async (columnN) => {
      const col = columns[columnN];
      if (col && col.isRestricted) {
        const res = restrictions.find(r => r?.column?._id === col?._id);
        if (!res) {
          return null;
        }
        return this.findOneByIdAndColumn(col.moduleRestriction, col.tableRestriction, col.columnRestriction, res.rowIdRestriction)
          .then(result => ({ columnId: col._id, value: result }))
          .catch(error => {
            console.error(`Error fetching data for column ${col._id}: ${error}`);
            return null;
          });
      }
      return null;
    }).filter(promise => promise !== null);

    await Promise.all(columnPromises).then(results => {

      results.forEach(result => {
        if (result) {
          row[result.columnId] = result.value;
        }
      });
    }).catch(error => {
      console.error(`An error occurred: ${error}`);
    });

    return row;

  }


  async findAll(dbName: string, tableName: string) {
    const client = Connection.getClient();
    return await client.db(dbName).collection(tableName).find().toArray();
  }

  async findManyByColumnAndValue(module, table, column, value) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const rows = await collection.find({
      [column]: value
    }).toArray();
    return rows;
  }

  async findManyByColumnAndSimilarValue(module, table, column, value) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);

    const regex = new RegExp(value, 'i');

    const rows = await collection.find({
      [column]: regex
    }).toArray();

    return rows;
  }

  async findOneByIdAndColumn(module: string, table: string, column: string, id: string) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const row = await collection.findOne(
      {
        _id: new ObjectId(id)
      }
    );


    return row ? row[column] : null;
  }

  async findOneById(module: string, table: string, id: string) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const row = await collection.findOne(
      {
        _id: new ObjectId(id)
      }
    );

    return row;
  }

  async updateByRowAndColumn(module: string, table: string, column: string, rowId: string, updateRowDto: any) {
    const client = Connection.getClient();
    const filter = { _id: new ObjectId(rowId) };
    const update = { $set: { [column]: updateRowDto } };
    const promise = client.db(module).collection(table).updateOne(filter, update);
    return await promise;
  }

  async getRestrictionByIdAndColumn(module: string, table: string, columnId: string, rowId: string) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const documentRestrictions = await collection.findOne(
      {
        __rows_restrictions__data__: "rows_restrictions"
      }
    )
    if (!documentRestrictions && !documentRestrictions?.data) {
      return;
    }
    return documentRestrictions.data.find(
      (cellRes: any) => {
        return cellRes.column._id === columnId && cellRes.rowId == rowId;
      }
    )
  }

  async updateRestrictions(module: string, table: string, updateRestrictionsDto: any) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const documentRestrictions = await collection.findOne(
      {
        __rows_restrictions__data__: "rows_restrictions"
      }
    )
    if (!documentRestrictions) {
      collection.insertOne({
        __rows_restrictions__data__: "rows_restrictions",
        data: updateRestrictionsDto
      });
    } else {
      updateRestrictionsDto.forEach(
        (res: any) => {
          const resIndex = documentRestrictions?.data?.findIndex(
            (r: any) => {
              return r.column._id === res.column._id && r.rowId === res.rowId
            }
          )
          if (resIndex > -1) {
            documentRestrictions.data[resIndex] = res;
          } else {
            documentRestrictions?.data?.push(...updateRestrictionsDto);
          }
        }
      )

      return collection.updateOne({
        __rows_restrictions__data__: "rows_restrictions"
      },
        {
          $set: documentRestrictions
        })
    }
  }

  async update(module: string, table: string, updateRowDto: any) {
    await this.upsertRestrictions(module, table, updateRowDto);
    const promises = [];
    for (const row of updateRowDto) {
      const filter = { _id: new ObjectId(row._id) };
      delete row._id;
      const update = { $set: row };
      const client = Connection.getClient();
      const promise = client.db(module).collection(table).updateOne(filter, update);
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  findRestrictions(rows: any[]) {
    return rows.find(
      (row) => {
        return row.__rows_restrictions__data__ !== undefined;
      }
    );
  }

  async upsertRestrictions(module: string, table: string, updateRowDto: any) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const restrictions = this.findRestrictions(updateRowDto);
    if (!restrictions) {
      return;
    }
    const documentRestrictions = await collection.findOne(
      {
        __rows_restrictions__data__: "rows_restrictions"
      }
    )
    if (!documentRestrictions) {
      collection.insertOne(restrictions);
    } else {
      collection.updateOne({
        __rows_restrictions__data__: "rows_restrictions"
      },
        {
          $set: restrictions
        })
    }
  }

  remove(module: string, table: string, deleteIds: any) {
    const deletePromises = [];
    deleteIds.forEach((deleteObj) => {
      const client = Connection.getClient();
      const deleteProm = client.db(module).collection(table).deleteOne(
        {
          _id: new ObjectId(deleteObj)
        }
      );
      deletePromises.push(deleteProm);
    });
    return Promise.all(deletePromises);
  }

}
