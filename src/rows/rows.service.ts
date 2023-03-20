import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
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

  findOne(id: number) {
    return `This action returns a #${id} row`;
  }

  update(id: number, updateRowDto: UpdateRowDto) {
    return `This action updates a #${id} row`;
  }

  remove(id: number) {
    return `This action removes a #${id} row`;
  }

}
