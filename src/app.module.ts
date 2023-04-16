import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorDataHandler } from './errorsHandler/errorsDictionary';
import { Connection } from './server/mongodb/connection';
import { ModulesModule } from './eqmodules/modules/modules.module';
import { TablesModule } from './eqmodules/tables/tables.module';
import { RowsModule } from './eqmodules/rows/rows.module';
import { ColumnsModule } from './eqmodules/columns/columns.module';


@Module({
  imports: [
    Mongoose,
    ModulesModule,
    TablesModule,
    RowsModule,
    ColumnsModule
  ],
  controllers: [AppController],
  providers: [AppService, ErrorDataHandler, Connection]
})
export class AppModule {}
