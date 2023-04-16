import { Test, TestingModule } from '@nestjs/testing';
import { RowsController } from './rows.controller';
import { RowsService } from './rows.service';

describe('RowsController', () => {
  let controller: RowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RowsController],
      providers: [RowsService],
    }).compile();

    controller = module.get<RowsController>(RowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
