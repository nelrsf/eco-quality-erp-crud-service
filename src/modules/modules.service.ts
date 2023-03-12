import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { AppService } from 'src/app.service';
import { TablesService } from 'src/tables/tables.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {

  private client: MongoClient;


  constructor(private appService: AppService, private tablesService: TablesService) {
    const databaseName = 'admin';
    const dbConnectionUrl = this.appService.getDbUrlConectionStringByDbName(databaseName);
    this.client = new MongoClient(dbConnectionUrl);
  }

  async findAll() {
    const databasesQuery = await this.client.db().admin().listDatabases();
    return databasesQuery.databases;
  }


  async findAllIncludingTables() {
    const databases = await this.findAll();
    const result = await Promise.all(databases.map(
      async (db) => {
        const tables = await this.tablesService.findAll(db.name);
        return {
          name: db.name,
          tables: tables
        }
      }
    ))
    return result;
  }


  create(createModuleDto: CreateModuleDto) {
    return 'This action adds a new module';
  }


  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
