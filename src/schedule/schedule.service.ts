import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SCHEDULE } from 'src/constants/enums/schedule/schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly userRepository: UsersService) {}

  @Cron(SCHEDULE.DELETE_UNCONFIRMED_USERS)
  async deleteUnconfirmedUsers() {
    const usersToDelete = await this.userRepository.findOverdue();
    if (usersToDelete.length) {
      for await (const user of usersToDelete) {
        await this.userRepository.removeOverdue(+user.user_id);
      }
    }
  }
}    