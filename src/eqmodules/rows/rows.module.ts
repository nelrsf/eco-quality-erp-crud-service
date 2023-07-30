import { Module } from '@nestjs/common';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { ColumnsService } from '../columns/columns.service';
import { RowEditGuard } from 'src/guards/row-edit.guard';
import { RowDeleteGuard } from 'src/guards/row-delete.guard';


@Module({
  controllers: [RowsController],
  providers: [
    RowsService, 
    ColumnsService, 
    AppService, 
    ErrorDataHandler, 
    RowEditGuard,
    RowDeleteGuard
  ]
})
export class RowsModule {}
