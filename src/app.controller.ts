import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
require('dotenv').config();

@Controller()
export class AppController {
  constructor() { }

  @Get('/getdatabaseurl')
  findAll(@Res() res) {
    res.status(HttpStatus.OK).json(process.env.DATABASE_URL);
  }

}
