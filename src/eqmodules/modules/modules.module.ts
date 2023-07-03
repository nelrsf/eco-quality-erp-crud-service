import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { AppService } from 'src/app.service';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { TablesService } from '../tables/tables.service';
import { TablesModule } from '../tables/tables.module';
import { FilterUserModules } from 'src/middlewares/FilterUserDatabases';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, TablesService, AppService, ErrorDataHandler],
  imports: [
    TablesModule
  ]
})
export class ModulesModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      ...[
        FilterUserModules
      ]
    ).forRoutes('/modules/')
  } 
  
 }
