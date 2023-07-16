import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { TablesService } from './tables.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { TableAdminGuard } from 'src/guards/table-admin.guard';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService, private errorHandler: ErrorDataHandler) { }

  @Get('metadata/:module/:table')
  getTableMetadata(@Res() res, @Param('module') module, @Param('table') table) {
    return this.tablesService.getTableMetadata(module, table).then(
      (metadata => {
        res.status(HttpStatus.OK).json(metadata);
      })
    ).catch(
      (error) => {
        const errorData = this.errorHandler.getErrorObjectByCode(error);
        res.status(errorData.status).json(errorData.message);
      }
    );
  }

  @Post('create/:module/:table')
  create(@Res() res, @Body() params: CreateTableDto) {
    return this.tablesService.create(params).then(
      (tables => {
        res.status(HttpStatus.OK).json(tables);
      })
    ).catch(
      (error) => {
        const errorData = this.errorHandler.getErrorObjectByCode(error);
        res.status(errorData.status).json(errorData.message);
      }
    );
  }

  @Get('/all/:module')
  findFlat(@Res() res, @Param('module') module) {
    this.tablesService.findAll(module).then(
      (collections => {
        res.status(HttpStatus.OK).json(collections);
      })
    );
  }

  @Get('/:module')
  findAll(@Res() res, @Param('module') module) {
    this.findAllByRoute(res, module, undefined);
  }

  @Get('/:module/:route')
  findAllByRoute(@Res() res, @Param('module') module, @Param('route') route) {
    this.tablesService.findAll(module).then(
      (collections => {
        const filteredCollections = this.tablesService.filterTablesByRoute(collections, route);
        res.status(HttpStatus.OK).json(filteredCollections);
      })
    );
  }

  @UseGuards(TableAdminGuard)
  @Post('/customize/:module')
  customizeTable(@Res() res, @Param('module') module: string, @Body() table: Table): void {
    this.tablesService.upsertTableConfiguration(module, table).then(
      (result) => {
        res.status(HttpStatus.OK).json(result);
      }
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @Post('delete/:module/:table')
  remove(@Param('module') module: string, @Param('table') table: string) {
    return this.tablesService.remove(module, table);
  }
}
