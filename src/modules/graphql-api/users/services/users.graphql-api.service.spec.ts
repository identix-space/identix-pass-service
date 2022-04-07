import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from '@/libs/database/entities';
import { UsersGraphqlApiService } from './users.graphql-api.service';

describe('UsersService', () => {
  let service: UsersGraphqlApiService;
  let usersRepositoryMock: Repository<UsersEntity>;
  const usersRepositoryToken = getRepositoryToken(UsersEntity);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: usersRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({}),
          },
        },
        UsersGraphqlApiService
      ],
    }).compile();

    service = module.get<UsersGraphqlApiService>(UsersGraphqlApiService);
    usersRepositoryMock = module.get(usersRepositoryToken);

    jest.clearAllMocks();
  });

  describe('services', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(usersRepositoryMock).toBeDefined();
    });
  });

  describe('createUser()', () => {
    it('email is undefined: should trow error', async () => {
      let result;
      try {
        result = await service.create({email: undefined});
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('Email is required');
      }

      expect(result).toBeUndefined();
    });

    it('user exists: should be trow error', async () => {
      const user = new UsersEntity();
      jest.spyOn(usersRepositoryMock, 'findOne').mockImplementation(() => {
        return new Promise(resolve => resolve(user));
      });

      let result;
      try {
        result = await service.create({ email: 'test@user.org'});
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('User already exists');
      }

      expect(result).toBeUndefined();
    });

    it('user not exists: should be create user', async () => {
      const email = 'test@user.org';

      const user = new UsersEntity();
      user.email = email;

      jest.spyOn(usersRepositoryMock, 'findOne').mockImplementation(() => {
        return new Promise(resolve => resolve(null));
      });

      const userRepoSaveSpy = jest.spyOn(usersRepositoryMock, 'save').mockImplementation(() => {
        return new Promise(resolve => resolve(user));
      });

      const result = await service.create({ email });

      expect(userRepoSaveSpy).toBeCalled();
      expect(userRepoSaveSpy.mock.calls[0][0].email).toBe(user.email);
      expect(result).toBeDefined();
      expect(result.email).toBe(email);
    });
  });
});
