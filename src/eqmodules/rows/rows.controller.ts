import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { RowsService } from './rows.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { ColumnsService } from '../columns/columns.service';
import { RowEditGuard } from 'src/guards/row-edit.guard';
import { RowDeleteGuard } from 'src/guards/row-delete.guard';
import { TableReadGuard } from 'src/guards/table-read.guard';

@Controller('rows')
export class RowsController {
  constructor(private readonly rowsService: RowsService,
    private readonly columnsService: ColumnsService, private errorHandler: ErrorDataHandler) { }

  @UseGuards(RowEditGuard)
  @Post('/create/:module/:table')
  create(@Res() res, @Body() createRowDto: { row: any, restrictions: Array<any> }, @Param('module') module: string, @Param('table') table: string) {
    const row = createRowDto.row;
    const restrictions = createRowDto.restrictions;
    return this.rowsService.create(module, table, row, restrictions).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    ).catch(
      (error) => {
        const errorData = this.errorHandler.getErrorObjectByCode(error);
        res.status(errorData.status).json(errorData.message);
      }
    );
  }

  @UseGuards(TableReadGuard)
  @Get('/:module/:table')
  findAll(@Res() res, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.findAll(module, table).then(
      (rows => {
        const columnsMetadata = this.columnsService.findAndDeleteColumnsMetadata(rows);
        if (!columnsMetadata || columnsMetadata.length === 0) {
          res.status(HttpStatus.OK).json([]);
          return;
        }
        const restrictions = this.rowsService.findRestrictions(rows);
        const filteredRows = this.columnsService.filterRowsByColumnsMetadata(columnsMetadata[0], rows);
        if (restrictions) {
          const rowToUpdate = filteredRows.find(
            (fr: any) => {
              return restrictions._id === fr._id;
            }
          );
          if (rowToUpdate) {
            Object.assign(rowToUpdate, restrictions);
          }
        }
        res.status(HttpStatus.OK).json(filteredRows);
      })
    );
  }


  @UseGuards(TableReadGuard)
  @Get('/filter/:module/:table/:column/:value')
  findManyByColumnAndValue(@Res() res, @Param() params: any) {
    const module = params.module;
    const table = params.table;
    const column = params.column;
    const value = params.value;
    return this.rowsService.findManyByColumnAndValue(module, table, column, value).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @UseGuards(TableReadGuard)
  @Get('/filter/similar/:module/:table/:column/:value')
  findManyByColumnAndSimilarValue(@Res() res, @Param() params: any) {
    const module = params.module;
    const table = params.table;
    const column = params.column;
    const value = params.value;
    return this.rowsService.findManyByColumnAndSimilarValue(module, table, column, value).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @UseGuards(TableReadGuard)
  @Get('/:module/:table/:id/:column')
  findOneByRowIdAndColumn(@Res() res, @Param() params: any) {
    const module = params.module;
    const table = params.table;
    const column = params.column;
    const id = params.id;
    return this.rowsService.findOneByIdAndColumn(module, table, column, id).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }


  @UseGuards(TableReadGuard)
  @Get('restrictions/:module/:table/:id/:column')
  findRestrictionByRowIdAndColumn(@Res() res, @Param() params: any) {
    const module = params.module;
    const table = params.table;
    const column = params.column;
    const id = params.id;
    return this.rowsService.getRestrictionByIdAndColumn(module, table, column, id).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @UseGuards(TableReadGuard)
  @Get('/:module/:table/:id')
  findOneByRowId(@Res() res, @Param() params: any) {
    const module = params.module;
    const table = params.table;
    const id = params.id;
    return this.rowsService.findOneById(module, table, id).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    )
  }

  @UseGuards(RowEditGuard)
  @Patch('/update/:module/:table')
  update(@Res() res, @Body() updateRowDto: any, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.update(module, table, updateRowDto).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    ).catch(
      (error) => {
        const errorData = this.errorHandler.getErrorObjectByCode(error);
        res.status(errorData.status).json(errorData.message);
      }
    );
  }

  @UseGuards(RowEditGuard)
  @Patch('/update/:module/:table/:column/:rowId')
  updateByRowAndColumn(@Res() res, @Body() updateRowDto: any, @Param('module') module: string, @Param('table') table: string, @Param('column') column: string, @Param('rowId') rowId: string) {
    return this.rowsService.updateByRowAndColumn(module, table, column, rowId, updateRowDto).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @UseGuards(RowEditGuard)
  @Patch('/updaterestrictions/:module/:table')
  updateRestrictions(@Res() res, @Body() updateRestrictionsDto: any, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.updateRestrictions(module, table, updateRestrictionsDto).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @UseGuards(RowDeleteGuard)
  @Post('/delete/:module/:table')
  remove(@Res() res, @Body() deleteIds: any, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.remove(module, table, deleteIds).then(
      (response) => {
        res.status(HttpStatus.OK).json(response);
      }
    );
  }
}
