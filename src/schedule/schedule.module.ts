import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}