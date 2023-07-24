import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorDataHandler } from './errorsHandler/errorsDictionary';
import { Connection } from './server/mongodb/connection';
import { ModulesModule } from './eqmodules/modules/modules.module';
import { TablesModule } from './eqmodules/tables/tables.module';
import { RowsModule } from './eqmodules/rows/rows.module';
import { ColumnsModule } from './eqmodules/columns/columns.module';
import { FilterUserModules } from './middlewares/FilterUserDatabases';
import { ModuleAdminGuard } from './guards/module-admin.guard';
import { TableAdminGuard } from './guards/table-admin.guard';
import { ColumnAdminGuard } from './guards/column-admin.guard';
import { ModuleDeleteGuard } from './guards/module-delete.guard';
import { TableEditGuard } from './guards/table-edit.guard';
import { TableDeleteGuard } from './guards/table-delete.guard';


@Module({
  imports: [
    Mongoose,
    ModulesModule,
    TablesModule,
    RowsModule,
    ColumnsModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ErrorDataHandler, 
    Connection, 
    ModuleAdminGuard, 
    TableAdminGuard, 
    ColumnAdminGuard,
    ModuleDeleteGuard,
    TableEditGuard,
    TableDeleteGuard
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      ...[
        FilterUserModules
      ]
    ).exclude(
      { path: '/modules/findone/:module', method: RequestMethod.GET },
    ).forRoutes('/modules/')
  }

}
