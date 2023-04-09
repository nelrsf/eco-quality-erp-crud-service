import { Module } from '@nestjs/common';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';
import { AppService } from 'src/app.service';
import { ColumnsService } from 'src/columns/columns.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';


@Module({
  controllers: [RowsController],
  providers: [RowsService, ColumnsService, AppService, ErrorDataHandler]
})
export class RowsModule {}
