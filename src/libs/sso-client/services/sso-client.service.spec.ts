import {Test, TestingModule} from '@nestjs/testing';

import {SsoClientService} from './sso-client.service';

describe('SsoClientService', () => {
  let service: SsoClientService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SsoClientService
      ],
    }).compile();

    service = module.get<SsoClientService>(SsoClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getToken(): result should be defined', async () => {
    const result = await service.validateUserSession('client:did:123456', 'user:did:54321');
    expect(result).toBeDefined();
  });
});
