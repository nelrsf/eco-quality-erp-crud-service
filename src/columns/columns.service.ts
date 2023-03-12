import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { AppService } from 'src/app.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {

  private client: MongoClient;

  constructor(private appService: AppService) {
    const databaseName = 'columns-metadata';
    const dbConnectionUrl = this.appService.getDbUrlConectionStringByDbName(databaseName);
    this.client = new MongoClient(dbConnectionUrl);
  }

  create(createColumnDto: CreateColumnDto) {
    return 'This action adds a new column';
  }

  findAll() {
    return `This action returns all columns`;
  }

  findOne(columnname: string, table: string, module: string) {
    return this.client.db().collection(module).findOne({
      fieldName: columnname,
      table: table
    });
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
