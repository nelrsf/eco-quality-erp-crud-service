import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateTableDto } from './dto/update-table.dto';
import { ModulesService } from 'src/modules/modules.service';
import { Table } from './entities/table.entity';
import { Connection } from 'src/server/mongodb/connection';

@Injectable()
export class TablesService {

  constructor() {}

  async create(moduleName: string, tableName: string) {
    const client = Connection.getClient();
    const newCollection = await client.db(moduleName).createCollection(tableName);
    await newCollection.insertOne({
      name__document_md: "document-metadata",
      table_metadata: {
        module: moduleName,
        table: tableName,
        label: tableName,
        description: "Descripción de " + tableName
      }
    });
    return await this.findAll(moduleName);
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
              description: ""
            }
          }
          const tableMetadata = documentMetadata.table_metadata;
          return {
            name: coll.name,
            label: tableMetadata?.label ? tableMetadata.label : coll.name,
            description: tableMetadata?.description ? tableMetadata.description : ""
          }
        }
      )
    )
    return this.filterModuleMetadata(await tables);
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
            description: table.description
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
            table_metadata: {
              name: table.name,
              label: table.label,
              description: table.description
            }
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
