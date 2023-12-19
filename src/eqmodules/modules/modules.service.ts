import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { Connection } from 'src/server/mongodb/connection';
import { TablesService } from '../tables/tables.service';
import { UsersTable } from '../tables/entities/UsersTable';
import { AdminFolder } from '../tables/entities/AdminFolder';
import { ProfilesTable } from '../tables/entities/ProfilesTable';
import { StructureConfiguration } from 'src/structure-configuration';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ModulesService {

  public static MODULE_METADATA_TAG = "__module__metadata__";
  private dbsToExclude: Array<string> = ['admin', 'local', 'config', '_eq__admin_manager'];


  constructor(private tablesService: TablesService, private config: StructureConfiguration) { }

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

      if (moduleMetadataDocument === null) {
        throw new Error('Module metadata not found');
      }

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
        const copyTables = JSON.parse(JSON.stringify(filteredTables));
        const nestedTables = this.nestTables(filteredTables, copyTables);
        const moduleMetadata = await this.findModuleMetadata(db.name);
        return {
          name: db.name,
          label: moduleMetadata?.label ? moduleMetadata.label : db.name,
          description: moduleMetadata?.description ? moduleMetadata.description : "",
          owner: moduleMetadata?.owner ? moduleMetadata?.owner : '',
          tables: nestedTables
        }
      }
    ))
    return result;
  }

  private nestTables(tables: Array<any>, allTables: Array<any>, routeFilter: string = "/") {
    tables = tables.filter(
      t => {
        let lastSegment;
        if (t.route !== '/') {
          const segments = t.route.split('/');
          lastSegment = segments[segments.length - 1];
        } else {
          lastSegment = "/";
        }

        return lastSegment === routeFilter
      });
    tables.forEach(
      (table: any) => {
        if (table.isFolder) {
          const subtables = allTables.filter(
            t => {
              const segments = t.route.split("/");
              const location = segments[segments.length - 1];
              return location === table.routeParam;
            });
          table.tables = this.nestTables(subtables, allTables, table.routeParam);
        }
      }
    );
    return tables;
  }

  filterModules(modules: Array<any>) {
    return modules.filter(
      m => {
        return !this.dbsToExclude.includes(m?.name);
      }
    );
  }


  async create(moduleName: string, userId: string) {
    const newClient = Connection.getClient();
    const dbName = await this.createModuleMetadataCollection(moduleName, userId, newClient);
    const adminRoute = await this.creadeAdminFolder(dbName, newClient);
    await this.createUsersPerModuleCollection(dbName, adminRoute, newClient);
    await this.createProfilesPerModuleCollection(dbName, adminRoute, newClient);
    return await this.findAll();
  }

  private async createModuleMetadataCollection(moduleName: string, userId: string, client: any) {
    const dbName = uuidv4()
    const collectionMetadataName = dbName + ModulesService.MODULE_METADATA_TAG;
    const db = client.db(dbName);
    await db.createCollection(collectionMetadataName);
    const collectionModuleMetadata = db.collection(collectionMetadataName);
    const documentModuleMetadata = new Module(dbName, moduleName, "descripcion de " + moduleName, userId);
    await collectionModuleMetadata.insertOne(documentModuleMetadata);
    return dbName;
  }

  private async createUsersPerModuleCollection(dbName: string, route: string, client: any) {
    const db = client.db(dbName);
    const collectionName = this.config.constants.usersTable;
    await db.createCollection(collectionName);
    const usersModuleCollection = db.collection(collectionName);
    let usersTable = new UsersTable(dbName, collectionName, this.config.constants.profiesTable, route)
    await usersModuleCollection.insertOne(
      usersTable.newTable
    );
  }

  private async createProfilesPerModuleCollection(dbName: string, route: string, client: any) {
    // const dbName = this.formattName(moduleName);
    const db = client.db(dbName);
    const collectionName = this.config.constants.profiesTable;
    await db.createCollection(collectionName);
    const usersModuleCollection = db.collection(collectionName);
    let profilesTable = new ProfilesTable(dbName, collectionName, route);
    await usersModuleCollection.insertOne(
      profilesTable.newTable
    );
    await usersModuleCollection.insertMany(
      profilesTable.newData
    );
  }

  private async creadeAdminFolder(dbName: string, client: any) {
    // const dbName = this.formattName(moduleName);
    const db = client.db(dbName);
    const collectionName = this.config.constants.adminFolder;
    const adminModuleCollection = db.collection(collectionName);
    let adminFolder = new AdminFolder(dbName, collectionName);
    await adminModuleCollection.insertOne(
      adminFolder.newFolder
    );
    return collectionName;
  }


  private formattName(value: string) {
    return value.replace(/[^a-zA-Z0-9]/g, "");
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
          description: module.description,
          permissions: module?.permissions ? module?.permissions : {}
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
            description: module.description,
            permissions: module?.permissions ? module?.permissions : {}
          }
        }
      );
    }

  }


  async findOne(moduleName: string) {
    const client = Connection.getClient();
    const db = client.db(moduleName);
    const collectionMetadata = db.collection(moduleName + '__module__metadata__');
    return await collectionMetadata.findOne({ name: moduleName });
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
