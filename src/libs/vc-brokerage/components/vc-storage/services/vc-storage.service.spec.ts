import {Test, TestingModule} from '@nestjs/testing';

import {VcStorageService} from './vc-storage.service';

describe('VCStorageService', () => {
  let service: VcStorageService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VcStorageService
      ],
    }).compile();

    service = module.get<VcStorageService>(VcStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createVC(): result should be defined', async () => {
    const result = await service.createVC('test:did:123456', {property1: "value1", property2: "value2"});
    expect(result).toBeDefined();
  });
});
