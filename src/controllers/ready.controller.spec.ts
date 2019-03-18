import { Test, TestingModule } from '@nestjs/testing';
import { ReadyController } from './ready.controller';

describe('Ready Controller', () => {
  let controller: ReadyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadyController],
    }).compile();

    controller = module.get<ReadyController>(ReadyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
