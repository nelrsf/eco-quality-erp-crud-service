import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { TableAdminGuard } from 'src/guards/table-admin.guard';
import { TableEditGuard } from 'src/guards/table-edit.guard';
import { TableDeleteGuard } from 'src/guards/table-delete.guard';

@Module({
  controllers: [TablesController],
  providers: [
    TablesService,
    AppService,
    ErrorDataHandler,
    TableAdminGuard,
    TableEditGuard,
    TableDeleteGuard],
  exports: [
    TablesService
  ]
})
export class TablesModule { }
