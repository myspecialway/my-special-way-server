import * as passport from 'passport';
// import * as passport from 'passport';
import { buildSchema } from 'graphql';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GraphQLModule, AuthModule],
})

export class AppModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) { }

  configure(consumer: MiddlewareConsumer) {
    const schema = buildSchema(`
        type Query {
            message: String
        }
      `);
    const root = {
      message: () => 'Welcome to My-Special-W@@y!',
    };
    consumer
      .apply(passport.initialize())
      .forRoutes('/graphql')
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes('/graphql')
      .apply(graphqlExpress(req => ({ schema, rootValue: root })))
      .forRoutes('/graphql')
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
      .forRoutes('/graphiql');
  }
}