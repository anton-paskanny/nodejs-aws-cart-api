import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { UsersService } from './services';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
