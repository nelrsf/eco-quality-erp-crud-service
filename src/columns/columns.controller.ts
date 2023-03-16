import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @Post('/create')
  create(@Res() res, @Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto).then(
      (data) => { 
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Get('/:module/:table/:columnname')
  findOne(@Res() res, @Param('columnname') columnname: string,
    @Param('table') table: string,
    @Param('module') module: string,) {
    return this.columnsService.findOne(columnname, table, module).then(
      (data) => { 
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  @Patch('/update')
  update(@Res() res, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(updateColumnDto).then(
      (data) => { 
        res.status(HttpStatus.OK).json(data);
      }
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}