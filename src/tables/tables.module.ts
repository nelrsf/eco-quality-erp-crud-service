import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [TablesController],
  providers: [TablesService, AppService],
  exports: [
    TablesService
  ]
})
export class TablesModule {}
