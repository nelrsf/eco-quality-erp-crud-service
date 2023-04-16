import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { TablesService } from '../tables/tables.service';
import { TablesModule } from '../tables/tables.module';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, TablesService, AppService, ErrorDataHandler],
  imports: [
    TablesModule
  ]
})
export class ModulesModule { }
