import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TablesModule } from 'src/tables/tables.module';
import { TablesService } from 'src/tables/tables.service';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, TablesService, AppService, ErrorDataHandler],
  imports: [
    TablesModule
  ]
})
export class ModulesModule { }
