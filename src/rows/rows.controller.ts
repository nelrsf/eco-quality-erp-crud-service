import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { RowsService } from './rows.service';
import { CreateRowDto } from './dto/create-row.dto';
import { UpdateRowDto } from './dto/update-row.dto';

@Controller('rows')
export class RowsController {
  constructor(private readonly rowsService: RowsService) {}

  @Post()
  create(@Body() createRowDto: CreateRowDto) {
    return this.rowsService.create(createRowDto);
  }

  @Get('/:module/:table')
  findAll(@Res() res, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.findAll(module, table).then(
      (rows => {
        res.status(HttpStatus.OK).json(rows);
      })
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rowsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRowDto: UpdateRowDto) {
    return this.rowsService.update(+id, updateRowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rowsService.remove(+id);
  }
}
