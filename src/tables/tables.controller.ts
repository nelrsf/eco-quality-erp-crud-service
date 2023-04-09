import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TablesService } from './tables.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { Table } from './entities/table.entity';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService, private errorHandler: ErrorDataHandler) { }

  @Post('create/:module/:table')
  create(@Res() res, @Body() params: any) {
    return this.tablesService.create(params.module, params.table).then(
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

  @Get('/:module')
  findAll(@Res() res, @Param('module') module) {
    this.tablesService.findAll(module).then(
      (collections => {
        res.status(HttpStatus.OK).json(collections);
      })
    );
  }

  @Post('/customize/:module')
  customizeModule(@Res() res, @Param('module') module: string, @Body() table: Table): void {
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
