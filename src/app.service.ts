import { Injectable } from '@nestjs/common';
require('dotenv').config();

@Injectable()
export class AppService {

  getDbUrlConectionStringByDbName(dbName: string) {
    console.log(process.env.DATABASE_URL)
    console.log(process.env.DATABASE_URL.replace('DATABASE_NAME', dbName))
    return process.env.DATABASE_URL.replace('DATABASE_NAME', dbName);
  }
}
