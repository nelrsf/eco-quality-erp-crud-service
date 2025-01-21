import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
require('dotenv').config();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/getdatabaseurl')
  findAll(@Res() res) {
    const response = this.appService.formatResponse(process.env.DATABASE_URL);
    res.status(HttpStatus.OK).json(response);
  }
}
