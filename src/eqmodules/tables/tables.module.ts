import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { TableAdminGuard } from 'src/guards/table-admin.guard';

@Module({
  controllers: [TablesController],
  providers: [TablesService, AppService, ErrorDataHandler, TableAdminGuard],
  exports: [
    TablesService
  ]
})
export class TablesModule {}
