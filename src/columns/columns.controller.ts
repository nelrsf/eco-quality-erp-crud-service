import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

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

  @Get('/:module/:table/:columnname')
  findOne(@Res() res, @Param('columnname') columnname: string,
    @Param('table') table: string,
    @Param('module') module: string) {
    return this.columnsService.findOne(columnname, table, module).then(
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

  @Post('/delete')
  remove(@Res() res, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.remove(updateColumnDto.columnName, updateColumnDto.table, updateColumnDto.module).then(
      (data) => {
        res.status(HttpStatus.OK).json(data);
      }
    );
  }
}
