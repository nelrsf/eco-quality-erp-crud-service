import { Test, TestingModule } from '@nestjs/testing';
import { RowsService } from './rows.service';

describe('RowsService', () => {
  let service: RowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RowsService],
    }).compile();

    service = module.get<RowsService>(RowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
