import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateTableDto } from './dto/update-table.dto';
import { Connection } from 'src/server/mongodb/connection';
import { ModulesService } from '../modules/modules.service';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TablesService {

  constructor() { }

  async create(params: CreateTableDto) {
    const client = Connection.getClient();
    const collectionName = uuidv4();
    const newCollection = await client.db(params.module).createCollection(collectionName);
    const { parentRoute, labelRoute } = await this.getParentRoute(params.route, client, params.module);
    await newCollection.insertOne({
      name__document_md: "document-metadata",
      table_metadata: {
        // module: params.module,
        // table: params.table,
        ...params,
        // ...(params.isFolder ? { isFolder: true } : {}),
        ...(params.isFolder ? { routeParam: collectionName } : {}),
        ...(parentRoute && parentRoute !== '/' ? { route: parentRoute + '/' + params.route } : { route: params.route }),
        label: params.table,
        description: "Descripción de " + params.table
      }
    });
    let tables = await this.findAll(params.module);
    return this.filterTablesByRoute(tables, params.route);
  }

  private async getParentRoute(route: string, client: any, module: string) {
    let parentRoute;
    let labelRoute;
    if (route) {
      const routeSegments = route.split('/');;
      const parentItem = await client
        .db(module)
        .collection(routeSegments[routeSegments.length - 1])
        .findOne({ name__document_md: "document-metadata" });
      parentRoute = parentItem.table_metadata.route;
    }
    return { parentRoute, labelRoute };
  }

  filterTablesByRoute(tables: any[], route: string) {
    if (!tables) {
      return [];
    }
    if (!route) {
      return tables.filter(
        (table) => {
          return !table.route || table.route === '/';
        }
      )
    };
    return tables.filter(
      (table) => {
        const segments = table.route.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment === route;
      }
    );
  }

  async findAll(dbName: string) {
    const client = Connection.getClient();
    const collections = await client.db(dbName).listCollections().toArray();
    const tables = Promise.all(
      collections.map(
        async coll => {
          const documentMetadata = await client.db(dbName)
            .collection(coll.name)
            .findOne({ name__document_md: "document-metadata" });
          if (!documentMetadata) {
            return {
              name: coll.name,
              label: coll.name,
              route: "/",
              description: "",
            }
          }
          const tableMetadata = documentMetadata.table_metadata;
          return {
            ...tableMetadata,
            name: coll.name,
            label: tableMetadata?.label ? tableMetadata.label : coll.name,
            isFolder: tableMetadata?.isFolder ? tableMetadata.isFolder : false,
            route: tableMetadata?.route ? tableMetadata.route : "/",
            viewMode: tableMetadata?.viewMode,
            routeParam: tableMetadata?.routeParam ? tableMetadata.routeParam : "",
            description: tableMetadata?.description ? tableMetadata.description : "",
            permissions: tableMetadata?.permissions ? tableMetadata.permissions : "",
          }
        }
      )
    )
    return this.filterModuleMetadata(await tables);
  }

  async getTableMetadata(module: string, table: string) {
    const client = Connection.getClient();
    const metadataDocument = await client
      .db(module)
      .collection(table)
      .findOne({ name__document_md: 'document-metadata' });
    return metadataDocument;
  }

  filterModuleMetadata(collections: Array<any>) {
    return collections.filter((coll) => {
      return !coll.name.endsWith(ModulesService.MODULE_METADATA_TAG)
    })
  }

  async upsertTableConfiguration(module: string, table: Table) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table.name);
    let documentMetadata = await collection.findOne({ name__document_md: "document-metadata" });
    if (!documentMetadata) {
      return await collection.insertOne(
        {
          name__document_md: "document-metadata",
          table_metadata:
          {
            name: table.name,
            label: table.label,
            description: table.description,
            permissions: table.permissions ? table.permissions : {}
          }
        }
      )
    } else {
      return await collection.updateOne(
        {
          _id: new ObjectId(documentMetadata._id)
        },
        {
          $set: {
            'table_metadata.name': table.name,
            'table_metadata.label': table.label,
            'table_metadata.route': table.route,
            'table_metadata.permissions': table.permissions ? table.permissions : {},
            'table_metadata.description': table.description
          }
        }
      );
    }

  }


  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(module: string, table: string) {
    const client = Connection.getClient();
    return client.db(module).dropCollection(table);
  }
}
