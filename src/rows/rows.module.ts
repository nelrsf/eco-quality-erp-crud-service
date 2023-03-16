import { Module } from '@nestjs/common';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';
import { AppService } from 'src/app.service';
import { ColumnsService } from 'src/columns/columns.service';


@Module({
  controllers: [RowsController],
  providers: [RowsService, ColumnsService, AppService]
})
export class RowsModule {}
