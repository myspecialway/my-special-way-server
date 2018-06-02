'use strict';

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
//import { MiddlewaresConsumer } from '@nestjs/common/interfaces/middlewares';
//import { UsersModule } from '../users/users.module';
//import { AuthMiddleware } from '../common/index';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
 import { buildSchema } from 'graphql';
import { GraphqlController } from './graphql.controller';
import { GraphqlService } from './graphql.service';
import { typeDefsProvider } from './typeDefs.provider';

@Module({
    imports: [],
    controllers: [GraphqlController],
    components: [
        GraphqlService,
        typeDefsProvider,
    ]
})
export class GraphqlModule implements NestModule {
    constructor() {}
  
    
        configure(consumer: MiddlewareConsumer) {
            const schema = buildSchema(`type Query {
                message: String
            }`);
const root = {
message: () => 'Welcome to My-Special-W@@y!',
};
          consumer
            .apply(graphqlExpress(req => ({ schema, rootValue: root })))
            .forRoutes(GraphqlController)
            /**
             * on using graphiQL all the requests are forwarded to the routes defines in the controller.
             * GraphiQL help to debug, and it simulates client queries
             */
            .apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes('/graphiql');
      }
  }

