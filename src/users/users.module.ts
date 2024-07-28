import { forwardRef, Module } from '@nestjs/common';

import { UsersService } from './services';
import { UsersController } from './users.controller';
import { DBModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => DBModule)],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
