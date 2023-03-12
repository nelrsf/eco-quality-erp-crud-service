import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { AppService } from 'src/app.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {

  private client: MongoClient;

  constructor(private appService: AppService) {
    const databaseName = 'admin';
    const dbConnectionUrl = this.appService.getDbUrlConectionStringByDbName(databaseName);
    this.client = new MongoClient(dbConnectionUrl);
  }

  create(createTableDto: CreateTableDto) {
    return 'This action adds a new table';
  }

  async findAll(dbName: string) {
    const collections = await this.client.db(dbName).listCollections().toArray();
    return collections;
  }



  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
