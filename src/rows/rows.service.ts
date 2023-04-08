import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId, WithId } from 'mongodb';
import { AppService } from 'src/app.service';
import { CreateRowDto } from './dto/create-row.dto';
import { UpdateRowDto } from './dto/update-row.dto';

@Injectable()
export class RowsService {

  private client: MongoClient;

  constructor(private appService: AppService) {
    const databaseName = 'admin';
    const dbConnectionUrl = this.appService.getDbUrlConectionStringByDbName(databaseName);
    this.client = new MongoClient(dbConnectionUrl);
  }


  create(module: string, table: string, createRowDto: any) {
    return this.client.db(module).collection(table).insertOne(
      createRowDto
    )
  }

  async findAll(dbName: string, tableName: string) {
    return await this.client.db(dbName).collection(tableName).find().toArray();
  }

  async findOneByIdAndColumn(module: string, table: string, column: string, id: string) {
    const collection = this.client.db(module).collection(table);
    const row = await collection.findOne(
      {
        _id: new ObjectId(id)
      }
    );
    
    return row[column];
  }

  async findOneById(module: string, table: string, id: string) {
    const collection = this.client.db(module).collection(table);
    const row = await collection.findOne(
      {
        _id: new ObjectId(id)
      }
    );
    
    return row;
  }

  async update(module: string, table: string, updateRowDto: any) {
    await this.upsertRestrictions(module, table, updateRowDto);
    const promises = [];
    for (const row of updateRowDto) {
      const filter = { _id: new ObjectId(row._id) };
      delete row._id;
      const update = { $set: row };
      const promise = this.client.db(module).collection(table).updateOne(filter, update);
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  findRestrictions(rows: any[]){
    return rows.find(
      (row)=>{
        return row.__rows_restrictions__data__ !== undefined;
      }
    );
  }

  async upsertRestrictions(module: string, table: string, updateRowDto: any){
    const collection = this.client.db(module).collection(table);
    const restrictions = this.findRestrictions(updateRowDto);
    if(!restrictions){
      return;
    }
    const documentRestrictions = await collection.findOne(
      {
        __rows_restrictions__data__ : "rows_restrictions"
      }
    )
    if(!documentRestrictions){
      collection.insertOne(restrictions);
    } else {
      collection.updateOne({
        __rows_restrictions__data__ : "rows_restrictions"
      },
      {
        $set: restrictions
      })
    }
  }

  remove(module: string, table: string, deleteIds: any) {
    const deletePromises = [];
    deleteIds.forEach((deleteObj) => {
      const deleteProm = this.client.db(module).collection(table).deleteOne(
        {
          _id: new ObjectId(deleteObj)
        }
      );
      deletePromises.push(deleteProm);
    });
    return Promise.all(deletePromises);
  }

}
