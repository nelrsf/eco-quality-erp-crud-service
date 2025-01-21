import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { v4 as uuidv4 } from 'uuid';
import { ColumnsDatabaseService } from './columns.database.service';

@Injectable()
export class ColumnsService {
  constructor(private readonly columnsDatabaseService: ColumnsDatabaseService) {}

  async findAll(table: string, module: string) {
    return this.columnsDatabaseService.findAll(table, module);
  }

  async findOne(columnnId: string, table: string, module: string) {
    return this.columnsDatabaseService.findOne(columnnId, table, module);
  }

  async upsert(createColumnDto: CreateColumnDto) {
    if (!createColumnDto._id) {
      const columnId = uuidv4();
      createColumnDto._id = columnId;
    }
    await this.columnsDatabaseService.upsert(createColumnDto);
    await this.columnsDatabaseService.createIndexToUniqueColumn(createColumnDto);
    await this.columnsDatabaseService.deleteIndexFromUniqueColumn(createColumnDto);
  }

  async remove(columnnId: string, table: string, module: string) {
    await this.columnsDatabaseService.deleteRestrictions(columnnId, table, module);
    await this.columnsDatabaseService.remove(columnnId, table, module);
  }

  findAndDeleteColumnsMetadata(rows: Array<any>): any {
    return this.columnsDatabaseService.findAndDeleteColumnsMetadata(rows);
  }

  filterRowsByColumnsMetadata(columnsMetadata: any, rows: Array<any>) {
    return this.columnsDatabaseService.filterRowsByColumnsMetadata(columnsMetadata, rows);
  }
}
