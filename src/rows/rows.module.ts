import { Module } from '@nestjs/common';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [RowsController],
  providers: [RowsService, AppService]
})
export class RowsModule {}
