import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { CreateColumnDto } from './dto/create-column.dto';
import { Connection } from 'src/server/mongodb/connection';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class ColumnsService {

  constructor() { }

  async findAll(table: string, module: string) {
    const client = await Connection.getClient();
    const documentMetadata = await client.db(module).collection(table).findOne({
      name__document_md: "document-metadata"
    });
    if (!documentMetadata) {
      return {};
    }
    delete documentMetadata._id;
    delete documentMetadata.name__document_md;
    delete documentMetadata.table_metadata;
    return documentMetadata;
  }


  async findOne(columnnId: string, table: string, module: string) {
    const client = Connection.getClient();
    const documentMetadata = await client.db(module).collection(table).findOne({
      name__document_md: "document-metadata"
    });
    return documentMetadata[columnnId];
  }

  async upsert(createColumnDto: CreateColumnDto) {
    const client = await Connection.getClient();
    const db = client.db(createColumnDto.module);
    const collection = db.collection(createColumnDto.table);
    const documentMetadata = await collection.findOne({ name__document_md: "document-metadata" });
    if(!createColumnDto._id){
      const columnId = uuidv4();
      createColumnDto._id = columnId;
    };
    let upsertResult;
    if (!documentMetadata) {
      const newDoccumentMetadata = { name__document_md: "document-metadata" };
      newDoccumentMetadata[createColumnDto._id] = createColumnDto;
      upsertResult = await collection.insertOne(newDoccumentMetadata);
      await this.createIndexToUniqueColumn(createColumnDto);
      await this.deleteIndexFromUniqueColumn(createColumnDto);
      return upsertResult;
    }
    documentMetadata[createColumnDto._id] = createColumnDto;
    upsertResult = await collection.updateOne(
      {
        name__document_md: "document-metadata"
      },
      {
        $set: documentMetadata
      }
    );
    await this.createIndexToUniqueColumn(createColumnDto);
    await this.deleteIndexFromUniqueColumn(createColumnDto);
    return upsertResult;
  }

  private async createIndexToUniqueColumn(createColumnDto: CreateColumnDto) {
    if (!createColumnDto.unique) {
      return;
    }
    const client = Connection.getClient();
    const db = client.db(createColumnDto.module);
    const collection = db.collection(createColumnDto.table);
    let fieldIndexData = {};
    fieldIndexData[createColumnDto._id] = 1;
    await collection.createIndex(fieldIndexData, { unique: true });
  }

  private async deleteIndexFromUniqueColumn(createColumnDto: CreateColumnDto) {
    if (createColumnDto.unique) {
      return;
    }
    const client = Connection.getClient();
    const db = client.db(createColumnDto.module);
    const collection = db.collection(createColumnDto.table);
    const indexName = `${createColumnDto._id}_1`;
    try {
      await collection.dropIndex(indexName);
    } catch {

    }
  }

  async deleteRestrictions(columnId: string, table: string, module: string) {
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const documentRestrictions = await collection.findOne({
      __rows_restrictions__data__: "rows_restrictions"
    });
    if (!documentRestrictions) {
      return
    }
    documentRestrictions.data.forEach(
      async (restriction, index) => {
        if (restriction.column._id === columnId) {
          documentRestrictions.data.splice(index, 1);
        }
      }
    );
    collection.updateOne({
      __rows_restrictions__data__: "rows_restrictions"
    },
      {
        $set: documentRestrictions
      })
  }

  async remove(columnnId: string, table: string, module: string) {
    await this.deleteRestrictions(columnnId, table, module);
    const client = Connection.getClient();
    const collection = client.db(module).collection(table);
    const documentMetadata = await collection.findOne({
      name__document_md: "document-metadata"
    });
    if (documentMetadata[columnnId]) {
      const unsetJson = {};
      unsetJson[columnnId] = ""
      return await collection.updateOne(
        {
          _id: documentMetadata._id
        },
        {
          $unset: unsetJson
        }
      );
    }
    return Promise.reject({
      error: "El objeto a eliminar no fue encontrado"
    })
  }

  findAndDeleteColumnsMetadata(rows: Array<any>): any {
    const indx = rows.findIndex((row) => {
      return row.name__document_md === "document-metadata";
    });
    if (indx < 0) {
      return;
    }
    return rows.splice(indx, 1);
  }

  filterRowsByColumnsMetadata(columnsMetadata: any, rows: Array<any>) {
    const columnsNames = Object.keys(columnsMetadata);
    const newRowsData: any[] = [];
    rows.forEach(
      (row) => {
        const rowKeys = Object.keys(row);
        const newRow = rowKeys.reduce((prev: any, curr: string) => {
          if (columnsNames.includes(curr)) {
            prev[curr] = row[curr];
          }
          return prev;
        }, {});
        newRowsData.push(newRow);
      }
    );
    return newRowsData;
  }
}
