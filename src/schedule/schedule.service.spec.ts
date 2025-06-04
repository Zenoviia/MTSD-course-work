import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { UsersService } from '../users/users.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let usersService: UsersService;

  const mockUsersService = {
    findOverdue: jest.fn(),
    removeOverdue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('deleteUnconfirmedUsers', () => {
    it('should call findOverdue and removeOverdue for each user', async () => {
      const mockUsers = [
        { user_id: 1 },
        { user_id: 2 },
      ];

      mockUsersService.findOverdue.mockResolvedValue(mockUsers);
      mockUsersService.removeOverdue.mockResolvedValue(undefined);

      await service.deleteUnconfirmedUsers();

      expect(usersService.findOverdue).toHaveBeenCalled();

      expect(usersService.removeOverdue).toHaveBeenCalledTimes(mockUsers.length);
      for (const user of mockUsers) {
        expect(usersService.removeOverdue).toHaveBeenCalledWith(user.user_id);
      }
    });

    it('should not call removeOverdue if no users found', async () => {
      mockUsersService.findOverdue.mockResolvedValue([]);

      await service.deleteUnconfirmedUsers();

      expect(usersService.findOverdue).toHaveBeenCalled();
      expect(usersService.removeOverdue).not.toHaveBeenCalled();
    });
  });
});
