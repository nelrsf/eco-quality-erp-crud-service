import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('/create')
  create(@Res() res, @Body('module') module: string) {
    return this.modulesService.create(module).then(
      (databases) => {
        const filteredDbs = this.modulesService.filterModules(databases);
        res.status(HttpStatus.OK).json(filteredDbs);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
}
