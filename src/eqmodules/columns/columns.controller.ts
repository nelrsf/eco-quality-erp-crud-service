import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { TableAdminGuard } from 'src/guards/table-admin.guard';
import { ColumnAdminGuard } from 'src/guards/column-admin.guard';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @UseGuards(ColumnAdminGuard)
  @Post('/upsert')
  upsert(@Res() res, @Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.upsert(createColumnDto).then(
      (data) => {
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  @Get('/:module/:table')
  findAll(@Res() res, @Param('table') table: string,
    @Param('module') module: string) {
    return this.columnsService.findAll(table, module).then(
      (data) => {
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  @Get('/:module/:table/:columnid')
  findOne(@Res() res, @Param('columnid') columnnId: string,
    @Param('table') table: string,
    @Param('module') module: string) {
    return this.columnsService.findOne(columnnId, table, module).then(
      (data) => {
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  // @Patch('/update')
  // update(@Res() res, @Body() updateColumnDto: UpdateColumnDto) {
  //   return this.columnsService.update(updateColumnDto).then(
  //     (data) => {
  //       res.status(HttpStatus.OK).json(data);
  //     }
  //   );
  // }

  @UseGuards(ColumnAdminGuard)
  @Post('/delete')
  remove(@Res() res, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.remove(updateColumnDto._id, updateColumnDto.table, updateColumnDto.module).then(
      (data) => {
        res.status(HttpStatus.OK).json(data);
      }
    );
  }
}
