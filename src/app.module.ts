import { Module } from '@nestjs/common';
import * as passport from 'passport';

import { GraphqlModule } from 'modules/graphql/graphql.module';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [GraphqlModule, AuthModule],
})
export class AppModule {}