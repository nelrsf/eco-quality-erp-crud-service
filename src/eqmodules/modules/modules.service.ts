import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { Connection } from 'src/server/mongodb/connection';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class ModulesService {

  public static MODULE_METADATA_TAG = "__module__metadata__";
  private dbsToExclude: Array<string> = ['admin', 'local'];


  constructor(private tablesService: TablesService) {

  }

  async findAll() {
    const client = Connection.getClient();
    const databasesQuery = await client.db().admin().listDatabases();
    return Promise.all(
      databasesQuery.databases.map(
        (db) => {
          const moduleMetadata = this.findModuleMetadata(db.name);
          if (moduleMetadata) {
            return moduleMetadata;
          } else {
            return Promise.resolve({
              name: db.name,
              label: db.name,
              description: ""
            })
          }
        }
      )
    )
  }

  async findModuleMetadata(moduleName: string) {
    try {
      const client = Connection.getClient();
      const moduleMetadata = client.db(moduleName).collection(moduleName + ModulesService.MODULE_METADATA_TAG);
      const moduleMetadataDocument = await moduleMetadata.findOne({ name: moduleName });
      return moduleMetadataDocument;
    } catch {
      return {
        name: moduleName,
        label: moduleName,
        description: ""
      };
    }
  }

  async findAllIncludingTables() {
    const databases = await this.findAll();
    const filteredDbs = this.filterModules(databases);
    const result = await Promise.all(filteredDbs.map(
      async (db) => {
        const tables = await this.tablesService.findAll(db.name);
        const filteredTables = this.tablesService.filterModuleMetadata(tables);
        const moduleMetadata = await this.findModuleMetadata(db.name);
        return {
          name: db.name,
          label: moduleMetadata?.label ? moduleMetadata.label : db.name,
          description: moduleMetadata?.description ? moduleMetadata.description : "",
          tables: filteredTables
        }
      }
    ))
    return result;
  }

  filterModules(modules) {
    return modules.filter(
      m => {
        return !this.dbsToExclude.includes(m?.name);
      }
    );
  }


  async create(moduleName: string) {
    const dbName = moduleName.replace(/ /g, "_");
    const newClient = Connection.getClient();
    const collectionMetadataName = dbName + ModulesService.MODULE_METADATA_TAG;
    const db = newClient.db(dbName);
    await db.createCollection(collectionMetadataName);
    const collectionModuleMetadata = db.collection(collectionMetadataName);
    const documentModuleMetadata = new Module(dbName, moduleName, "descripcion de " + moduleName);
    await collectionModuleMetadata.insertOne(documentModuleMetadata);
    return await this.findAll();
  }

  async upsertModuleConfiguration(module: Module) {
    const client = Connection.getClient();
    const collection = client.db(module.name).collection(module.name + ModulesService.MODULE_METADATA_TAG);
    let documentMetadata = await collection.findOne({ name: module.name });
    if (!documentMetadata) {
      return await collection.insertOne(
        {
          name: module.name,
          label: module.label,
          description: module.description
        }
      )
    } else {
      return await collection.updateOne(
        {
          _id: new ObjectId(documentMetadata._id)
        },
        {
          $set: {
            name: module.name,
            label: module.label,
            description: module.description
          }
        }
      );
    }

  }


  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  async remove(moduleName: string) {
    const client = Connection.getClient();
    const db = client.db(moduleName);
    const collections = await db.listCollections().toArray();
    const result = await Promise.all(
      collections.map(
        (collection) => {
          return db.dropCollection(collection.name);
        }
      )
    );
    return result.reduce((current: boolean, previous: boolean) => {
      return current && previous
    }, true)
  }
}