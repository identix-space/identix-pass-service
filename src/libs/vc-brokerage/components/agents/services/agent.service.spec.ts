import {Test, TestingModule} from '@nestjs/testing';

import {AgentService} from './holder.service';

describe('HolderService', () => {
  let service: AgentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
