import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildSchema } from 'graphql';

@Module({
  imports: [GraphQLModule],
  controllers: [AppController],
  providers: [ AppService ],
})

export class AppModule implements  NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {}

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
          .apply(graphqlExpress(req => ({ schema, rootValue: root })))
          .forRoutes('/graphql')
          .apply(graphiqlExpress({ endpointURL: '/graphql' }))
          .forRoutes('/graphiql');
    }
}