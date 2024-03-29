import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { TablesService } from '../tables/tables.service';
import { TablesModule } from '../tables/tables.module';
import { FilterUserModules } from 'src/middlewares/FilterUserDatabases';
import { ModuleAdminGuard } from 'src/guards/module-admin.guard';
import { ModuleDeleteGuard } from 'src/guards/module-delete.guard';
import { StructureConfiguration } from 'src/structure-configuration';

@Module({
  controllers: [ModulesController],
  providers: [
    ModulesService,
    TablesService,
    AppService,
    ErrorDataHandler,
    ModuleAdminGuard,
    ModuleDeleteGuard,
    StructureConfiguration
  ],
  imports: [
    TablesModule
  ]
})
export class ModulesModule {

}
