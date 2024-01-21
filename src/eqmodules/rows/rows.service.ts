import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Connection } from 'src/server/mongodb/connection';

@Injectable()
export class RowsService {

  constructor() { }


  create(module: string, table: string, createRowDto: any) {
    const client = Connection.getClient();
    return client.db(module).collection(table).insertOne(
      createRowDto
    )
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

    return row[column];
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
