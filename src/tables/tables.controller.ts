import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) { }

  @Post('create/:module/:table')
  create(@Res() res, @Body() params: any) {
    return this.tablesService.create(params.module, params.table).then(
      (tables => {
        res.status(HttpStatus.OK).json(tables);
      })
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


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }
}
