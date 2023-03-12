import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { AppModule } from 'src/app.module';
import { TablesModule } from 'src/tables/tables.module';
import { TablesService } from 'src/tables/tables.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, TablesService, AppService],
  imports: [
    TablesModule
  ]
})
export class ModulesModule { }
