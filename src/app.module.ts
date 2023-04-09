import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { TablesModule } from './tables/tables.module';
import { RowsModule } from './rows/rows.module';
import { ColumnsModule } from './columns/columns.module';
import { ErrorDataHandler } from './errorsHandler/errorsDictionary';

@Module({
  imports: [
    Mongoose,
    ModulesModule,
    TablesModule,
    RowsModule,
    ColumnsModule
  ],
  controllers: [AppController],
  providers: [AppService, ErrorDataHandler]
})
export class AppModule {}
