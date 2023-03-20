import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { RowsService } from './rows.service';
import { UpdateRowDto } from './dto/update-row.dto';
import { ColumnsService } from 'src/columns/columns.service';

@Controller('rows')
export class RowsController {
  constructor(private readonly rowsService: RowsService, 
              private readonly columnsService: ColumnsService) {}

  @Post('/create/:module/:table')
  create(@Res() res, @Body() createRowDto: any, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.create(module, table, createRowDto).then(
      (response)=>{
        res.status(HttpStatus.OK).json(response);
      }
    );
  }

  @Get('/:module/:table')
  findAll(@Res() res, @Param('module') module: string, @Param('table') table: string) {
    return this.rowsService.findAll(module, table).then(
      (rows => {
        const columnsMetadata = this.columnsService.findAndDeleteColumnsMetadata(rows);
        if(!columnsMetadata || columnsMetadata.length === 0){
          res.status(HttpStatus.OK).json([]);
          return;
        }
        const filteredRows = this.columnsService.filterRowsByColumnsMetadata(columnsMetadata[0], rows);
        res.status(HttpStatus.OK).json(filteredRows);
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
