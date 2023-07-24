import { Controller, Get, Post, Body, Patch, Param, Res, HttpStatus, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ErrorDataHandler } from 'src/errorsHandler/errorsDictionary';
import { Module } from './entities/module.entity';
import { ModuleAdminGuard } from 'src/guards/module-admin.guard';
import { ModuleDeleteGuard } from 'src/guards/module-delete.guard';
require('dotenv').config();

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService, private errorHandler: ErrorDataHandler) { }

  @Post('/create')
  create(@Req() req, @Res() res, @Body('module') module: string) {
    return this.modulesService.create(module, req.userId).then(
      (databases) => {
        const filteredDbs = this.modulesService.filterModules(databases);
        res.status(HttpStatus.OK).json(filteredDbs);
      }
    ).catch(
      (error) => {
        const errorData = this.errorHandler.getErrorObjectByCode(error);
        res.status(errorData.status).json(errorData.message);
      }
    );
  }

  @Get('/')
  findAll(@Res() res) {
    this.modulesService.findAll().then(
      (databases) => {
        const filteredDbs = this.modulesService.filterModules(databases);
        res.status(HttpStatus.OK).json(filteredDbs);
      }
    ).catch(
      (error) => {
        res.status(HttpStatus.NOT_FOUND).json(error);
      }
    );
  }

  @Get('/modulestables')
  findAllModulesTables(@Res() res): void {
    this.modulesService.findAllIncludingTables().then(
      (modulesTables) => {
        res.status(HttpStatus.OK).json(modulesTables);
      }
    );
  }

  @UseGuards(ModuleAdminGuard)
  @Post('/customize')
  customizeModule(@Res() res, @Body() module: Module): void {
    this.modulesService.upsertModuleConfiguration(module).then(
      (result) => {
        res.status(HttpStatus.OK).json(result);
      }
    );
  }

  @Get('/findone/:module')
  findOne(@Res() res, @Param('module') moduleName: string) {
    return this.modulesService.findOne(moduleName).then(
      (result) => {
        res.status(HttpStatus.OK).json(result);
      }
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @UseGuards(ModuleDeleteGuard)
  @Post(':module')
  remove(@Res() res, @Body('module') module: string) {
    return this.modulesService.remove(module).then(
      (result) => {
        if (result) {
          res.status(HttpStatus.OK).json("Módulo eliminado correcamente");
        } else {
          res.status(HttpStatus.CONFLICT).json("Error al eliminar el módulo");
        }
      }
    );
  }
}
