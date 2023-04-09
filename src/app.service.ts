import { Injectable } from '@nestjs/common';
require('dotenv').config();

@Injectable()
export class AppService {

  getDbUrlConectionStringByDbName(dbName: string) {
    return process.env.DATABASE_URL.replace('DATABASE_NAME', dbName);
  }
}
