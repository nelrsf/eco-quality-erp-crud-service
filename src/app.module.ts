import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { RowEditGuard } from './guards/row-edit.guard';
import { RowDeleteGuard } from './guards/row-delete.guard';
import { StructureConfiguration } from './structure-configuration';
import { FilterHashAndSalt } from './middlewares/FilterHashAndSalt';
import { FilterReadableTables } from './middlewares/FilterReadableTables';
import { FilterReadableModulesTables } from './middlewares/FilterReadableModulesTables';
import { FilterReadableColumns } from './middlewares/FilterReadableColumns';
import { FilterReadableColumn } from './middlewares/FilterReadableColumn';
import { TableReadGuard } from './guards/table-read.guard';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
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
    TableDeleteGuard,
    TableReadGuard,
    RowEditGuard,
    RowDeleteGuard,
    StructureConfiguration
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

    consumer.apply(
      ...[
        FilterHashAndSalt
      ]
    ).forRoutes('/rows/')

    consumer.apply(
      ...[
        FilterReadableTables
      ]
    ).exclude(
      { path: '/tables/metadata/:module/:table', method: RequestMethod.GET }
    )
      .forRoutes(
        '/tables/all/:module',
        '/tables/:module/:route',
        '/tables/:module')

    consumer.apply(
      ...[
        FilterReadableModulesTables
      ]
    ).forRoutes(
      '/modules/modulestables')

    consumer.apply(
      ...[
        FilterReadableColumns
      ]
    ).exclude(
      { path: '/columns/:module/:table/:columnid', method: RequestMethod.GET }
    ).forRoutes(
      '/columns/:module/:table')

    consumer.apply(
      ...[
        FilterReadableColumn
      ]
    ).exclude(
      { path: '/columns/:module/:table', method: RequestMethod.GET }
    ).forRoutes(
      '/columns/:module/:table/:columnid')
  }


}
