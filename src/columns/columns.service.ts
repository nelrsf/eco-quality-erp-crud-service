import { Injectable } from '@nestjs/common';
import { CreateIndexesOptions, MongoClient } from 'mongodb';
import { AppService } from 'src/app.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {

  private client: MongoClient;

  constructor(private appService: AppService) {
    const databaseName = 'admin';
    const dbConnectionUrl = this.appService.getDbUrlConectionStringByDbName(databaseName);
    this.client = new MongoClient(dbConnectionUrl);
  }

  async findAll(table: string, module: string) {
    const documentMetadata = await this.client.db(module).collection(table).findOne({
      name__document_md: "document-metadata"
    });
    if (!documentMetadata) {
      return {};
    }
    delete documentMetadata._id;
    delete documentMetadata.name__document_md;
    return documentMetadata;
  }


  async findOne(columnname: string, table: string, module: string) {
    const documentMetadata = await this.client.db(module).collection(table).findOne({
      name__document_md: "document-metadata"
    });
    return documentMetadata[columnname];
  }

  async upsert(createColumnDto: CreateColumnDto) {
    const db = this.client.db(createColumnDto.module);
    const collection = db.collection(createColumnDto.table);
    const documentMetadata = await collection.findOne({ name__document_md: "document-metadata" });
    if (!documentMetadata) {
      const newDoccumentMetadata = { name__document_md: "document-metadata" };
      newDoccumentMetadata[createColumnDto.columnName] = createColumnDto;
      return await collection.insertOne(newDoccumentMetadata);
    }
    documentMetadata[createColumnDto.columnName] = createColumnDto;
    return await collection.updateOne(
      {
        name__document_md: "document-metadata"
      },
      {
        $set: documentMetadata
      }
    );
  }

  async remove(columnname: string, table: string, module: string) {
    const collection = this.client.db(module).collection(table);
    const documentMetadata = await collection.findOne({
      name__document_md: "document-metadata"
    });
    if (documentMetadata[columnname]) {
      const unsetJson = {};
      unsetJson[columnname] = ""
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
