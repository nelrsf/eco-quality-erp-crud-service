import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { AppService } from 'src/app.service';
import { ColumnAdminGuard } from 'src/guards/column-admin.guard';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, AppService, ColumnAdminGuard]
})
export class ColumnsModule {}
