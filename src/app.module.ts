import { Module } from '@nestjs/common';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersistenceModule } from './modules/persistence/persistence.module';

@Module({
  imports: [GraphqlModule, AuthModule, PersistenceModule],
})
export class AppModule {}
