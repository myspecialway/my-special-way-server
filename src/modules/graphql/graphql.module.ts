'use strict';

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../common/index';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import { GraphqlController } from './graphql.controller';

@Module({
    imports: [],
    controllers: [GraphqlController],
    providers: [],
})
export class GraphqlModule implements NestModule {
    constructor() {}
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(GraphqlController)
        /**
         * on using graphiQL all the requests are forwarded to the routes defines in the controller.
         * GraphiQL help to debug, and it simulates client queries
         */
        .apply(graphiqlExpress({ endpointURL: '/graphql' }))
        .forRoutes('/graphiql');
    }
}