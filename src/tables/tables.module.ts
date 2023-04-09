import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errors/errorsDictionary';

@Module({
  controllers: [TablesController],
  providers: [TablesService, AppService, ErrorDataHandler],
  exports: [
    TablesService
  ]
})
export class TablesModule {}
