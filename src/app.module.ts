import { Module } from '@nestjs/common';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersistenceModule } from './modules/persistence/persistence.module.temp';

@Module({
  imports: [GraphqlModule, AuthModule, PersistenceModule],
})
export class AppModule {}