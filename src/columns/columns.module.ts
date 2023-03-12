import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, AppService]
})
export class ColumnsModule {}
